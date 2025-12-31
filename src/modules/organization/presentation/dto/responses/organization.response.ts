import { Exclude, Expose } from 'class-transformer';
import { Organization, OrganizationStatus } from '../../../domain';

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

  @Expose({ name: 'logo_url' })
  logoUrl: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(org: Organization) {
    this.id = org.id;
    this.name = org.name;
    this.taxCode = org.taxCode;
    this.status = org.status;
    this.phone = org.phone;
    this.email = org.email;
    this.website = org.website;
    this.address = org.address;
    this.logoUrl = org.logoUrl;
    this.createdAt = org.createdAt!;
    this.updatedAt = org.updatedAt!;
  }
}
