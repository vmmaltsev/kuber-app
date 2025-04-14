require("dotenv").config(); // Если используешь .env

const http = require("http");

const port = process.env.PORT || 3000;

const options = {
    timeout: 2000,
    host: "localhost",
    port,
    path: "/ping",
};

const request = http.request(options, (res) => {
    console.info("✅ STATUS:", res.statusCode);
    process.exitCode = res.statusCode === 200 ? 0 : 1;
    process.exit();
});

request.on("error", (err) => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
});

// Защита от зависания, если сервер не отвечает
request.setTimeout(2000, () => {
    console.error("❌ Timeout: No response received within 2s");
    request.destroy();
    process.exit(1);
});

request.end();
