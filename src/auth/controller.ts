import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

import { KnexPgUserRepository } from '../users/repository'
import { LoginUser } from './service'
import { AuthService } from './service1'

export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private authService: AuthService,
    private userRepository: KnexPgUserRepository
  ) { }

  async register(req: Request, res: Response) {
    const { login, password } = req.body

    const hash = await this.authService.hashPassword(password)
    const newUser = { createdAt: new Date(), hash: hash, login: login, updatedAt: new Date() }
    await this.userRepository.create(newUser)

    res.json({ message: 'User registered successfully' })
  }

  async login(req: Request, res: Response) {
    const { login, password } = req.body

    try {
      const user = await this.loginUser.execute(login, password)

      if (!user) return

      const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
      })

      res.json({ token })
    } catch (error) {
      res.status(401).json({ error })
    }
  }
}
