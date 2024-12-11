export class User {
  constructor(
    public id: number,
    public login: string,
    public hash: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
