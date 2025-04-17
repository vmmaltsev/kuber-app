const express = require("express");

function createMainRouter({ requestService, csrfProtection, generateToken }) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      await requestService.registerView();
      const response = await requestService.getStats();
      response.api = "node";
      res.json(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/ping", (req, res) => {
    res.send("pong");
  });

  router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: generateToken(req, res) });
  });

  router.get("/healthz", (req, res) => {
    res.json({ status: "ok" });
  });

  return router;
}

module.exports = createMainRouter; 