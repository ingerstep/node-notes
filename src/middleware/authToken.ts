import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface DecodedToken {
  id: string
  role: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })

    req.user = decoded as DecodedToken

    next()
  })
}
