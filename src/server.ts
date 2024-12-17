import express from 'express'
import bodyParser from 'body-parser'
import nunjucks from 'nunjucks'
import path from 'path'

import { njkConfig } from './config/njk'
import { authRoutes } from './auth/routes'
import { authenticateToken } from './middleware/authToken'
import { errorHandler } from './middleware/errorHandler'
import { noteRoutes } from './notes/routes'

class Server {
  app = express()
  port = process.env.PORT || 3000
  applyMiddleware() {
    this.app.use(express.static(path.join(__dirname, '..', 'public')))

    njkConfig(this.app)
    this.app.set('view engine', 'njk')

    this.app.use(bodyParser.json())

    this.app.use('/notes', noteRoutes)
    this.app.use('/', authRoutes)

    this.app.get('/dashboard', (req, res) => {
      res.send(nunjucks.render('dashboard.njk'))
    })

    this.app.get('/dashboard/auth', authenticateToken, (req, res) => {
      res.send({ user: req.user })
    })

    this.app.get('/', (req, res) => {
      res.send(nunjucks.render('index.njk'))
    })

    this.app.use((req, res) => {
      res.status(404).send(nunjucks.render('404.njk'))
    })

    this.app.use(errorHandler)
  }

  start() {
    this.applyMiddleware()

    this.app.listen(this.port, async () => {
      console.log(`server started: http://localhost:${this.port}`)
    })
  }
}

export const server = new Server()
