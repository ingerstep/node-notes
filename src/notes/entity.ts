export type NotePromise = Pick<Note, 'id' | 'title' | 'text'>
export type NewNote = Pick<Note, 'title' | 'text' | 'userId'>

export class Note {
  constructor(
    public id: number,
    public title: string,
    public text: string,
    public createdAt: Date,
    public updatedAt: Date,
    public archived: boolean,
    public userId: number
  ) { }

  archive() {
    this.archived = true
  }

  restore() {
    this.archived = false
  }
}
