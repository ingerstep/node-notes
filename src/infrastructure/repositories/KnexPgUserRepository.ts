import { User, UserRepository } from "../../domain";
import { db } from "../database";

export class KnexPgUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    await db("users").insert({
      id: user.id,
      login: user.login,
      hash: user.hash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    const row = await db("users").where({ login: login }).first();
    if (!row) return null;
    return new User(row.id, row.login, row.hash, row.createdAt, row.updatedAt);
  }

  async findById(id: number): Promise<User | null> {
    const row = await db("users").where({ id: id }).first();
    if (!row) return null;
    return new User(row.id, row.login, row.hash, row.createdAt, row.updatedAt);
  }
}
