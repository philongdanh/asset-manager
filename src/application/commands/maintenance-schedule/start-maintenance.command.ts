export class StartMaintenanceCommand {
  constructor(
    public readonly id: string,
    public readonly performedByUserId: string,
  ) {}
}
