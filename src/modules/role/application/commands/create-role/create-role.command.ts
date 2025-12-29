export class CreateRoleCommand {
    constructor(
        public readonly orgId: string,
        public readonly name: string,
        public readonly permIds?: string[],
    ) { }
}
