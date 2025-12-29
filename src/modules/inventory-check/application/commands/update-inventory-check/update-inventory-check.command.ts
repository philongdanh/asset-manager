export class UpdateInventoryCheckCommand {
    constructor(
        public readonly id: string,
        public readonly notes?: string,
        public readonly status?: string,
        public readonly checkDate?: Date,
    ) { }
}
