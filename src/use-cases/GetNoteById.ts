import { NoteRepository } from "../domain/interfaces/NoteRepository";

export class GetNoteById {
  constructor(private noteRepository: NoteRepository) { }

  async execute(id: number) {
    return await this.noteRepository.findById(id)
  }
}
