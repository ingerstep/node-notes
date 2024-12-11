import jwt from "jsonwebtoken";

import { AuthService } from "..";
import { LoginUser } from "../../use-cases";
import { User } from "../../domain";
import { KnexPgUserRepository } from "../../infrastructure";

export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private authService: AuthService,
    private userRepository: KnexPgUserRepository,
  ) {}

  async register(req: Request, res: Response) {
    const { login, password } = req.body;

    const hash = await this.authService.hashPassword(password);
    const user = new User(0, login, hash, new Date(), new Date());
    await this.userRepository.create(user);

    res.json({ message: "User registered successfully" });
  }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;

    try {
      const user = await this.loginUser.execute(login, password);

      if (!user) return;

      const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
}
