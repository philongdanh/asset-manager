import { Expose } from 'class-transformer';

export class InventoryCheckResponse {
    @Expose()
    id: string;

    @Expose()
    organization_id: string;

    @Expose()
    check_date: Date;

    @Expose()
    checker_user_id: string;

    @Expose()
    status: string;

    @Expose()
    notes: string | null;

    @Expose()
    created_at: Date;

    @Expose()
    updated_at: Date;
}
