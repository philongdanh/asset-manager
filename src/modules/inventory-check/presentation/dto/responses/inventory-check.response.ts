import { Expose } from 'class-transformer';

export class InventoryCheckResponse {
    @Expose()
    id: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'check_date' })
    checkDate: Date;

    @Expose({ name: 'checker_user_id' })
    checkerUserId: string;

    @Expose()
    status: string;

    @Expose()
    notes: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;
}
