export class CreateInventoryCheckCommand {
    constructor(
        public readonly organizationId: string,
        public readonly createdByUserId: string,
        public readonly checkDate?: Date,
        public readonly notes?: string,
    ) { }
}
