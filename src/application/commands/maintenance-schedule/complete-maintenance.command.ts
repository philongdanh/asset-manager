export class CompleteMaintenanceCommand {
    constructor(
        public readonly id: string,
        public readonly result: string,
        public readonly actualCost: number | null,
    ) { }
}
