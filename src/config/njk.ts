import nunjucks from "nunjucks";

import type { Express } from "express";

export const njkConfig = (app: Express) => nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
