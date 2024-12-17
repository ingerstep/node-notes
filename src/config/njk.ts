import nunjucks from 'nunjucks'

import type { Express } from 'express'

export const njkConfig = (app: Express) =>
  nunjucks.configure('public/views', {
    autoescape: true,
    express: app,
  })
