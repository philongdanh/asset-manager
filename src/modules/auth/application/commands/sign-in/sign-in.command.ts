export class SignInCommand {
  constructor(
    public readonly orgId: string,
    public readonly username: string,
    public readonly password: string,
  ) {}
}
