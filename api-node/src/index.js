require("dotenv").config(); // Поддержка .env

const { getDateTimeAndRequests, insertRequest } = require("./db");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
const port = process.env.PORT || 3000;

// 📥 Middleware
app.use(morgan("tiny"));
app.use(cookieParser()); // обязательный для работы csrf

// 🛡️ Включаем CSRF-защиту через cookie
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// 👇 Добавляем route, который отдаёт CSRF-токен клиенту
app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
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

// Запуск сервера
const server = app.listen(port, () => {
    console.log(`🚀 Node API is running on http://localhost:${port}`);
});

// Корректное завершение по SIGTERM (например, Docker stop)
process.on("SIGTERM", () => {
    console.debug("🛑 SIGTERM received: closing HTTP server");
    server.close(() => {
        console.debug("✅ HTTP server closed");
    });
});

// Также обрабатываем Ctrl+C
process.on("SIGINT", () => {
    console.debug("🛑 SIGINT received: shutting down HTTP server");
    server.close(() => {
        console.debug("✅ HTTP server closed");
        process.exit(0);
    });
});
