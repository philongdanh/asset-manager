export class UpdateUserEmailCommand {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
