import { NotePromise } from "./entity";

export interface NoteRepository {
  getNotes(params: { age: string; search: string; page: number }, userId: number): Promise<NotePromise[]>
  createNote(title: string, text: string, userId: number): Promise<NotePromise>
  getNote(id: number): Promise<NotePromise>
  archiveNote(id: number): Promise<void>
  unarchiveNote(id: number): Promise<void>
  editNote(id: number, title: string, text: string): Promise<NotePromise>
  deleteNote(id: number): Promise<void>
  deleteAllArchived(userId: number): Promise<void>
  notePdfUrl(id: number): Promise<string>
}
