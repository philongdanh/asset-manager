export class UpdateUserUsernameCommand {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}
