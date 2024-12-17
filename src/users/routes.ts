import { Router } from 'express'

import { KnexPgUserRepository } from './repository'
import { GetUserById } from './service'
import { UserController } from './controller'

export const userRoutes = Router()

const userRepository = new KnexPgUserRepository()
const getUserById = new GetUserById(userRepository)
const userController = new UserController(getUserById)

userRoutes.get('/user/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  await userController.getUser(req, res)
})
