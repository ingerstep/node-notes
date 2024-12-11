import { Note } from "..";

export interface NoteRepository {
  create(note: Note): Promise<void>;
  findByUserId(userId: number): Promise<Note[]>;
  findById(noteId: number): Promise<Note | null>;
  update(note: Note): Promise<void>;
  delete(noteId: number): Promise<void>;
}
