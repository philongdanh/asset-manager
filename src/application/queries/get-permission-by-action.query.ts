export class GetPermissionByActionQuery {
  constructor(
    public readonly module: string,
    public readonly action: string,
  ) {}
}
