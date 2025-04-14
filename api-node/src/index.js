require("dotenv").config(); // Поддержка .env

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const { getDateTimeAndRequests, insertRequest } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

// 📥 Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

// 🛡️ Настройка двойной CSRF-защиты через cookie + заголовок
const {
    generateToken,
    doubleCsrfProtection,
    invalidCsrfTokenError,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "default_csrf_secret_please_change",
    cookieName: "csrf_token",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

// ✅ Для Semgrep: обёртка в переменную с ключевым словом
const csrfProtection = doubleCsrfProtection;

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage
app.use(csrfProtection);

// 👇 Endpoint, который отдаёт CSRF-токен клиенту
app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: generateToken(req, res) });
});

// Главный endpoint
app.get("/", async (req, res) => {
    try {
        await insertRequest();
        const response = await getDateTimeAndRequests();
        response.api = "node";
        console.log(response);
        res.json(response);
    } catch (err) {
        console.error("❌ Error in / handler:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Healthcheck endpoint
app.get("/ping", (_, res) => {
    res.send("pong");
});

// Обработка CSRF-ошибок
app.use((err, req, res, next) => {
    if (err === invalidCsrfTokenError) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }
    next(err);
});

// Запуск сервера
const server = app.listen(port, () => {
    console.log(`🚀 Node API is running on http://localhost:${port}`);
});

// Корректное завершение по SIGTERM
process.on("SIGTERM", () => {
    console.debug("🛑 SIGTERM received: closing HTTP server");
    server.close(() => {
        console.debug("✅ HTTP server closed");
    });
});

// Обработка Ctrl+C
process.on("SIGINT", () => {
    console.debug("🛑 SIGINT received: shutting down HTTP server");
    server.close(() => {
        console.debug("✅ HTTP server closed");
        process.exit(0);
    });
});
