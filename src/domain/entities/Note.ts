export class Note {
  constructor(
    public id: number,
    public header: string,
    public markdown: string,
    public createdAt: Date,
    public archived: boolean,
    public userId: number
  ) { }

  archive() {
    this.archived = true;
  }

  restore() {
    this.archived = false;
  }
}
