import { Exclude, Expose } from 'class-transformer';
import { OrganizationStatus } from 'src/domain/identity/organization';

@Exclude()
export class OrganizationResponse {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose({ name: 'tax_code' })
    taxCode: string | null;

    @Expose()
    status: OrganizationStatus;

    @Expose()
    phone: string | null;

    @Expose()
    email: string | null;

    @Expose()
    website: string | null;

    @Expose()
    address: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<OrganizationResponse>) {
        Object.assign(this, partial);
    }
}
