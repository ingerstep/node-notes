import { Request, Response } from "express";

import { GetNoteById } from "../../use-cases";

interface NoteRequestParams {
  id: string;
}

export class NoteController {
  constructor(private getNoteById: GetNoteById) {}

  async getNote(req: Request<NoteRequestParams>, res: Response) {
    const id = parseInt(req.params.id, 10);
    const note = await this.getNoteById.execute(id);
    res.json(note);
  }
}
