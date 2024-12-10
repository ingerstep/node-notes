import express from "express";
import bodyParser from "body-parser";

import { njkConfig } from "./config/njk";
import { noteRoutes } from "./interface/routes/noteRoutes";

class Server {
  app = express();
  port = process.env.PORT || 3000;

  applyMiddleware() {
    njkConfig(this.app)
    this.app.set("view engine", "njk");
    this.app.use(bodyParser.json())
    this.app.use('/api', noteRoutes)
  }

  start() {
    this.applyMiddleware()

    this.app.listen(this.port, async () => {
      console.log(`server started: http://localhost:${this.port}`);
    })
  }
}

export const server = new Server()
