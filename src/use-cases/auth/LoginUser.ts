import { User, UserRepository } from "../../domain";
import { AuthService } from "../../interface";

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(login: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) throw new Error("User not found");

    const isPasswordValid = await this.authService.verifyUserPassword(password, user.hash);

    if (!isPasswordValid) throw new Error("Invalid password");

    return user; // JWT
  }
}
