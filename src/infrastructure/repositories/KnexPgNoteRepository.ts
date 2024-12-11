import knex from "knex";

import { Note, NoteRepository } from "../../domain";

export class KnexPgNoteRepository implements NoteRepository {
  async create(note: Note): Promise<void> {
    await knex("notes").insert({
      id: note.id,
      header: note.header,
      markdown: note.markdown,
      created_at: note.createdAt,
      archived: note.archived,
      user_id: note.userId,
    });
  }

  async findByUserId(userId: number): Promise<Note[]> {
    const rows = await knex("notes").where({ user_id: userId });
    return rows.map((row) => new Note(
      row.id,
      row.header,
      row.markdown,
      row.created_at,
      row.updated_at,
      row.archived,
      row.user_id
    ));
  }

  async findById(noteId: number): Promise<Note | null> {
    const row = await knex("notes").where({ id: noteId }).first();
    if (!row) return null;
    return new Note(
      row.id,
      row.header,
      row.markdown,
      row.created_at,
      row.updated_at,
      row.archived,
      row.user_id
    );
  }

  async update(note: Note): Promise<void> {
    await knex("notes").where({ id: note.id }).update({
      header: note.header,
      markdown: note.markdown,
      archived: note.archived,
    });
  }

  async delete(noteId: number): Promise<void> {
    await knex("notes").where({ id: noteId }).delete();
  }
}
