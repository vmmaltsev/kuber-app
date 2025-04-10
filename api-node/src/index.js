require("dotenv").config(); // Поддержка .env

const { getDateTimeAndRequests, insertRequest } = require("./db");
const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

// HTTP логгирование
app.use(morgan("tiny"));

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
