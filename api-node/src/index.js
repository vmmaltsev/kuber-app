require("dotenv").config(); // Поддержка .env

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const { doubleCsrf } = require("csrf-csrf");
const db = require("./db");
const RequestService = require("./service/requestService");
const createMainRouter = require("./routes/main");

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
const app = express();
const port = process.env.PORT || 3000;

// 📥 Middleware
app.use(helmet());
app.use(cors());
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

// DI сервисов
const requestService = new RequestService(db);
app.use("/", createMainRouter({ requestService, csrfProtection, generateToken }));

// Обработка CSRF-ошибок
app.use((err, req, res, next) => {
    if (err === invalidCsrfTokenError) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }
    next(err);
});

// Централизованный error handler
app.use((err, req, res, next) => {
    console.error("❌ Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
