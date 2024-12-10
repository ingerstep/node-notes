import { Router } from "express";

import { GetNoteById } from "../../use-cases/GetNoteById";
import { NoteController } from "../controllers/NoteController";
import { KnexPgNoteRepository } from "../../infrastructure/repositories/KnexPgNoteRepository";

const router = Router()

const noteRepository = new KnexPgNoteRepository()
const getNoteById = new GetNoteById(noteRepository)
const noteController = new NoteController(getNoteById)

router.get("/note/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await noteController.getNote(req, res);
});

export { router as noteRoutes }
