import { User } from "./entity"

export interface UserRepository {
  create(user: User): Promise<void>
  findById(id: number): Promise<User | null>
  findByLogin(login: string): Promise<User | null>
}
