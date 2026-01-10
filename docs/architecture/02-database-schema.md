# Database Schema Documentation

## Overview

The Asset Management System uses a PostgreSQL database with a comprehensive schema designed to support multi-tenancy, asset lifecycle management, inventory control, procurement, and financial tracking. The schema follows modern database design patterns including soft deletion, audit logging, and referential integrity.

## Schema Design Principles

### 1. Multi-tenancy Pattern

Every tenant-specific table includes a `tenant_id` foreign key to the `tenants` table, ensuring complete data isolation between organizations.

### 2. Soft Delete Pattern

All major entities implement soft deletion using a `deleted_at` timestamp column, allowing for data recovery and maintaining referential integrity.

### 3. Audit Trail

Comprehensive audit logging captures all significant data changes for compliance and debugging purposes.

### 4. Hierarchical Structures

Self-referencing relationships enable flexible organizational and categorical hierarchies.

### 5. Type Safety

Enumerations ensure data consistency for status fields and other constrained values.

## Enum Definitions

### Asset Condition

```prisma
enum AssetCondition {
  DAMAGED
  EXCELLENT
  FAIR
  GOOD
  NEW
  POOR
  UNUSABLE
  USED
}
```

### Asset Disposal Status

```prisma
enum AssetDisposalStatus {
  APPROVED
  CANCELLED
  COMPLETED
  PENDING
  REJECTED
}
```

### Asset Disposal Type

```prisma
enum AssetDisposalType {
  DAMAGED_BEYOND_REPAIR
  DISCARD
  DONATION
  LOST
  SALE
}
```

### Asset Item Status

```prisma
enum AssetItemStatus {
  AVAILABLE
  DISPOSED
  IN_USE
  LOST
  UNDER_MAINTENANCE
  UNDER_REPAIR
}
```

### Asset Transfer Status

```prisma
enum AssetTransferStatus {
  APPROVED
  CANCELLED
  COMPLETED
  IN_TRANSIT
  PENDING
  REJECTED
}
```

### Maintenance Status

```prisma
enum MaintenanceStatus {
  CANCELLED
  COMPLETED
  IN_PROGRESS
  PENDING
}
```

### Maintenance Type

```prisma
enum MaintenanceType {
  CORRECTIVE
  PREVENTIVE
}
```

### Purchase Order Status

```prisma
enum PurchaseOrderStatus {
  APPROVED
  CANCELLED
  DRAFT
  ORDERED
  RECEIVED
}
```

### Tenant Status

```prisma
enum TenantStatus {
  ACTIVE
  INACTIVE
}
```

### User Status

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
}
```

## Core Models

### Tenant

The central entity representing an organization using the system.

**Fields:**

- `id`: UUID primary key
- `name`: Organization name
- `status`: ACTIVE/INACTIVE status
- `code`: Unique organization code (optional)
- `phone`, `email`, `address`: Contact information
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- One-to-many with all tenant-specific entities
- Central point for multi-tenancy isolation

### Department

Represents organizational units within a tenant.

**Fields:**

- `id`: UUID primary key
- `tenant_id`: Reference to owning tenant
- `name`: Department name
- `parent_id`: Optional reference to parent department for hierarchies
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant
- Self-referencing hierarchy (parent/children)
- Contains Users and AssetItems
- Has BudgetPlans

### User

System users with authentication and authorization.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `department_id`: Organizational context
- `username`, `password`, `email`: Authentication credentials
- `is_root`: Superuser flag
- `status`: ACTIVE/INACTIVE status
- `avatar_url`: Profile image (optional)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant and optional Department
- Creates and holds AssetItems
- Performs maintenance and approves disposals
- Initiates and receives transfers

## Asset Management Models

### AssetCategory

Hierarchical classification system for assets.

**Fields:**

- `id`: UUID primary key
- `tenant_id`: Reference to owning tenant
- `name`, `code`: Category identifier
- `parent_id`: Optional parent category for hierarchies
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant
- Self-referencing hierarchy
- Contains AssetTemplates and InventoryItems

### AssetTemplate

Blueprint for asset types with specifications and defaults.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `category_id`: Organizational and categorical context
- `code`, `name`: Template identifier
- `model`, `manufacturer`, `description`, `specifications`: Asset details
- `default_purchase_price`, `default_warranty_months`: Financial and warranty defaults
- `track_quantity`, `min_stock`, `max_stock`: Inventory management
- `require_serial`: Serial number requirement flag
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant and AssetCategory
- Has many AssetItems

### AssetItem

Individual asset instances in the system.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `template_id`: Context and type reference
- `code`: Unique asset identifier
- `serial_number`: Optional serial number
- `purchase_date`, `purchase_price`, `current_value`: Financial tracking
- `status`, `condition`: Current state and condition
- `location`: Physical location
- `warranty_start_date`, `warranty_end_date`: Warranty period
- `created_by_user_id`, `current_department_id`, `current_user_id`: Assignment tracking
- `supplier_id`, `purchase_order_id`: Procurement reference
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant, AssetTemplate
- Optional relationships to Creator, CurrentDepartment, CurrentUser, Supplier, PurchaseOrder
- Has MaintenanceSchedules, AssetTransfers, AssetDisposals

### MaintenanceSchedule

Tracks maintenance activities for assets.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `asset_item_id`: Context and asset reference
- `date`: Scheduled date
- `type`: PREVENTIVE/CORRECTIVE
- `status`: PENDING/IN_PROGRESS/COMPLETED/CANCELLED
- `description`: Maintenance details
- `estimated_cost`, `actual_cost`: Financial tracking
- `performed_by_user_id`: Technician reference
- `result`: Outcome description
- Timestamps: `created_at`, `updated_at`

**Relationships:**

- Belongs to Tenant and AssetItem
- Optional relationship to Performer (User)

### AssetTransfer

Records movement of assets between departments/users.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `asset_item_id`: Context and asset reference
- `transfer_date`: Transfer date
- `from_department_id`, `to_department_id`: Department movement
- `from_user_id`, `to_user_id`: User assignment change
- `reason`: Transfer justification
- `status`: PENDING/APPROVED/REJECTED/COMPLETED/IN_TRANSIT/CANCELLED
- Timestamps: `created_at`, `updated_at`

**Relationships:**

- Belongs to Tenant and AssetItem
- Optional relationships to FromDepartment, ToDepartment, FromUser, ToUser

### AssetDisposal

Manages end-of-life processing for assets.

**Fields:**

- `id`: UUID primary key
- `asset_item_id`, `tenant_id`: Asset and context reference
- `disposal_date`: Disposal date
- `disposal_type`: DAMAGED_BEYOND_REPAIR/DISCARD/DONATION/LOST/SALE
- `disposal_value`: Financial recovery amount
- `reason`: Disposal justification
- `approved_by_user_id`: Approver reference
- `status`: PENDING/APPROVED/REJECTED/COMPLETED/CANCELLED
- Timestamps: `created_at`, `updated_at`

**Relationships:**

- Belongs to AssetItem and Tenant
- Optional relationship to Approver (User)

## Inventory Management Models

### InventoryItem

Tracks consumable stock items.

**Fields:**

- `id`: UUID primary key
- `tenant_id`: Owning tenant
- `category_id`, `supplier_id`: Classification and source
- `sku`: Stock keeping unit
- `name`, `description`: Item details
- `unit`: Measurement unit (default: "piece")
- `current_stock`, `min_stock`, `max_stock`: Stock level management
- `unit_cost`, `total_value`: Financial tracking
- `storage_location`: Physical storage
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant
- Optional relationships to AssetCategory and Supplier

## Supplier & Procurement Models

### Supplier

Vendor/supplier information.

**Fields:**

- `id`: UUID primary key
- `tenant_id`: Owning tenant
- `code`, `name`: Supplier identifier
- `phone`, `email`, `address`: Contact information
- Timestamps: `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to Tenant
- Supplies AssetItems and InventoryItems
- Receives PurchaseOrders

### PurchaseOrder

Procurement documentation.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `supplier_id`: Context and supplier reference
- `po_number`: Purchase order number
- `order_date`: Order date
- `total_amount`: Order value
- `status`: DRAFT/APPROVED/CANCELLED/ORDERED/RECEIVED
- `notes`: Additional information
- Timestamps: `created_at`, `updated_at`

**Relationships:**

- Belongs to Tenant and Supplier
- Contains AssetItems

## Budget Management Models

### BudgetPlan

Departmental budget allocation and tracking.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `department_id`: Context and department reference
- `fiscal_year`: Budget year
- `allocated_amount`: Budget allocation
- `spent_amount`: Current spending
- `notes`: Budget notes
- Timestamps: `created_at`, `updated_at`

**Relationships:**

- Belongs to Tenant and Department

## Audit Logs Model

### AuditLog

Tracks system activities for compliance and debugging.

**Fields:**

- `id`: UUID primary key
- `tenant_id`, `user_id`: Context and actor reference
- `action`: Performed action
- `entity_type`, `entity_id`: Affected entity
- `old_value`, `new_value`: Data changes
- `action_time`: Timestamp of action

**Relationships:**

- Belongs to Tenant and User

## Indexes and Constraints

### Unique Constraints

- `tenants(code)` - Unique organization code
- `users(email)` - Unique email address
- `users(tenant_id, username)` - Unique username per tenant
- `departments(tenant_id, name)` - Unique department name per tenant
- `suppliers(tenant_id, code)` - Unique supplier code per tenant
- `purchase_orders(tenant_id, po_number)` - Unique PO number per tenant
- `asset_categories(tenant_id, code)` - Unique category code per tenant
- `asset_templates(tenant_id, code)` - Unique template code per tenant
- `asset_items(tenant_id, code)` - Unique asset code per tenant
- `asset_items(tenant_id, serial_number)` - Unique serial number per tenant
- `inventory_items(tenant_id, sku)` - Unique SKU per tenant

### Foreign Key Constraints

All foreign keys include `onDelete` specifications:

- `Cascade` for tenant relationships (cleanup on tenant deletion)
- `Restrict` for hierarchical relationships (prevent deletion with children)
- `Cascade` for dependent records (maintenance, transfers, disposals)

## Database Migration Strategy

### Prisma Migrations

The system uses Prisma Migrate for database schema evolution:

```bash
# Create a new migration
npx prisma migrate dev --name [migration_name]

# Apply migrations to database
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Guidelines

1. Always create migrations for schema changes
2. Include data migration scripts when necessary
3. Test migrations in development before production
4. Backup database before applying production migrations
5. Use meaningful migration names

## Performance Considerations

### Indexing Strategy

- Primary keys automatically indexed
- Foreign keys benefit from indexes for join performance
- Unique constraints create indexes
- Consider additional indexes for frequently queried fields

### Query Optimization

- Use selective field queries (avoid SELECT \*)
- Implement pagination for large datasets
- Consider materialized views for complex reports
- Use database-level constraints for data integrity

### Scalability Considerations

- Multi-tenancy design supports horizontal scaling
- Soft delete pattern maintains performance with archived data
- Audit logging separate from transactional tables
- Consider partitioning for very large tables

## Data Integrity

### Referential Integrity

- All relationships properly defined with foreign keys
- Cascade delete rules maintain consistency
- Restrict delete rules prevent orphaned hierarchies

### Business Logic Constraints

- Enumerations enforce valid values
- Unique constraints prevent duplicates
- Required fields ensure complete data
- Default values provide sensible defaults

### Temporal Consistency

- `created_at` and `updated_at` timestamps track record lifecycle
- `deleted_at` enables soft deletion with recovery
- `action_time` in audit logs provides precise activity timing

## Security Considerations

### Multi-tenancy Isolation

- Row-level security through tenant_id foreign keys
- Application-level tenant validation
- No cross-tenant data leakage possible at database level

### Audit Trail

- Comprehensive logging of all data modifications
- Immutable audit records
- User attribution for all actions

### Data Protection

- Sensitive fields (passwords) hashed at application level
- No sensitive data in audit log values
- Regular backup and encryption at res
