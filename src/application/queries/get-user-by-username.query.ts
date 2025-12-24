export class GetUserByUsernameQuery {
  constructor(
    public readonly organizationId: string,
    public readonly username: string,
  ) {}
}
