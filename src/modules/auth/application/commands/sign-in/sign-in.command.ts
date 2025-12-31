export class SignInCommand {
  constructor(
    public readonly orgId: string | undefined, // Changed to string | undefined or just string? if it comes from body it might be undefined
    public readonly username: string,
    public readonly password: string,
  ) {}
}
