import { Note } from "../entities/Note";

export interface NoteRepository {
  save(note: Note): Promise<void>;
  findByUserId(userId: number): Promise<Note[]>;
  findById(noteId: number): Promise<Note | null>;
  update(note: Note): Promise<void>;
  delete(noteId: number): Promise<void>;
}
