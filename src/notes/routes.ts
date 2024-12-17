import { Router } from 'express'

import { NoteController } from './controller'
import { KnexPgNoteRepository } from './repository'
import { GetNoteById } from './service'

export const noteRoutes = Router()

const noteRepository = new KnexPgNoteRepository()
const getNoteById = new GetNoteById(noteRepository)
const noteController = new NoteController(getNoteById)

noteRoutes.get('/note/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  await noteController.getNote(req, res)
})
