import { Request, Response } from "express";

import { GetUserById } from "../../use-cases";

interface UserRequestParams {
  id: string;
}

export class UserController {
  constructor(private getNoteById: GetUserById) {}

  async getUser(req: Request<UserRequestParams>, res: Response) {
    const id = parseInt(req.params.id, 10);
    const note = await this.getNoteById.execute(id);
    res.json(note);
  }
}
