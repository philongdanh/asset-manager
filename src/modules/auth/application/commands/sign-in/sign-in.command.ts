export class SignInCommand {
  constructor(
    public readonly orgId: string | null,
    public readonly username: string,
    public readonly password: string,
  ) { }
}
