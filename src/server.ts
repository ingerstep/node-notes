import express from "express";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";

import { njkConfig } from "./config/njk";
import { authRoutes, errorHandler, noteRoutes } from "./interface";

class Server {
  app = express();
  port = process.env.PORT || 3000;

  applyMiddleware() {
    this.app.use(errorHandler);

    njkConfig(this.app);
    this.app.set("view engine", "njk");

    this.app.use(bodyParser.json());

    this.app.use("/api", noteRoutes);
    this.app.use("/", authRoutes);
    this.app.use("/", (req, res) => {
      res.send(nunjucks.render("index.njk"));
    });
    this.app.use("/dashboard", (req, res) => {
      res.send(nunjucks.render("dashboard.njk"));
    });
  }

  start() {
    this.applyMiddleware();

    this.app.listen(this.port, async () => {
      console.log(`server started: http://localhost:${this.port}`);
    });
  }
}

export const server = new Server();
