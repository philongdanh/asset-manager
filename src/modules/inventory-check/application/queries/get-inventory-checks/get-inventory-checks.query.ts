export class GetInventoryChecksQuery {
    constructor(
        public readonly organizationId: string,
        public readonly options: {
            status?: string;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
        } = {},
    ) { }
}
