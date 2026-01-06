export class SignInCommand {
  constructor(
    public readonly organizationId: string | null,
    public readonly username: string,
    public readonly password: string,
  ) {}
}
