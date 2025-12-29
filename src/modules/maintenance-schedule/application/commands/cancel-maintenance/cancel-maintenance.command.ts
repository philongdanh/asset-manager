export class CancelMaintenanceCommand {
    constructor(
        public readonly id: string,
        public readonly reason: string,
    ) { }
}
