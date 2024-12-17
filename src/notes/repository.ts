import { db } from "../config/db";

import { NewNote, Note, NotePromise } from "./entity";
import { NoteRepository } from "./interface";

export class KnexPgNoteRepository implements NoteRepository {
  async getNotes(params: { age: string; search: string; page: number }, userId: number): Promise<NotePromise[]> {
    try {
      const notes = await db.table('notes')
        .where('userId', userId)
        .where('archived', false)
        .andWhere('title', 'like', `%${params.search}%`)
        .offset((params.page - 1) * 10)
        .limit(10);

      return notes.map(note => ({
        id: note.id,
        title: note.title,
        text: note.text,
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  async createNote(title: string, text: string, userId: number): Promise<NotePromise> {
    try {
      const newNote: NewNote = {
        title,
        text,
        userId,
      }
      const [id] = await db.table('notes').insert(newNote).returning('id')
      return {
        id,
        title,
        text,
      }
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async getNote(id: number): Promise<NotePromise> {
    try {
      const note: Note = await db.table('notes').where({ id }).first();

      if (!note) {
        throw new Error('Note not found');
      }

      return {
        id: note.id,
        title: note.title,
        text: note.text
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  }

  async archiveNote(id: number): Promise<void> {
    try {
      const note = await db.table('notes')
        .where({ id })
        .update({
          archived: true,
          updatedAt: db.fn.now(),
        });

      if (note === 0) {
        throw new Error('Note not found');
      }
    } catch (error) {
      console.error('Error archiving note:', error);
      throw error;
    }
  }

  async unarchiveNote(id: number): Promise<void> {
    try {
      const note = await db.table('notes')
        .where({ id })
        .update({
          archived: false,
          updatedAt: db.fn.now(),
        });

      if (note === 0) {
        throw new Error('Note not found');
      }
    } catch (error) {
      console.error('Error unarchiving note:', error);
      throw error;
    }
  }

  async editNote(id: number, title: string, text: string): Promise<NotePromise> {
    try {
      const updatedNote = await db.table('notes')
        .where({ id })
        .update({
          title,
          text,
        })
        .returning(['id', 'title', 'text']);

      if (updatedNote.length === 0) {
        throw new Error('Note not found');
      }

      return updatedNote[0];
    } catch (error) {
      console.error('Error editing note:', error);
      throw error;
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      const note = await db.table('notes')
        .where({ id })
        .delete()

      if (note === 0) {
        throw new Error('Note not found');
      }
    } catch (error) {
      console.error('Error delete note:', error);
      throw error;
    }
  }

  async deleteAllArchived(userId: number): Promise<void> {
    try {
      const result = await db.table('notes')
        .where('userId', userId)
        .andWhere('archived', true)
        .delete();

      if (result === 0) {
        throw new Error('No archived notes found');
      }
    } catch (error) {
      console.error('Error deleting archived notes:', error);
      throw error;
    }
  }

  async notePdfUrl(id: number): Promise<string> {
    try {
      const note = await db.table('notes').where({ id }).first();

      if (!note) {
        throw new Error('Note not found');
      }

      const pdfUrl = `/pdfs/notes/${note.id}.pdf`;
      return pdfUrl;
    } catch (error) {
      console.error('Error fetching PDF URL:', error);
      throw error;
    }
  }
}
