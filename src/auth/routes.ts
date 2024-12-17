import { Router } from 'express'

import { AuthController } from './controller'
import { KnexPgUserRepository } from '../users/repository'
import { LoginUser } from './service'
import { AuthService } from './service1'

export const authRoutes = Router()

const userRepository = new KnexPgUserRepository()
const loginUser = new LoginUser(userRepository, new AuthService())
const authService = new AuthService()
const authController = new AuthController(loginUser, authService, userRepository)

authRoutes.post('/signup', async (req, res) => await authController.register(req, res))
authRoutes.post('/login', async (req, res) => await authController.login(req, res))
