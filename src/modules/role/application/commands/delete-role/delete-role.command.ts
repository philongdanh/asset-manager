export class DeleteRoleCommand {
  constructor(public readonly roleId: string, public readonly organizationId?: string) { }
}
