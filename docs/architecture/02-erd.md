# ER Diagram - Asset Management System

```mermaid
---
config:
  layout: elk
  theme: redux-color
  themeVariables:
    fontFamily: EB Garamond
---
erDiagram
	direction LR
	Tenant {
		string id PK ""  
		string name  ""  
		enum status  ""  
		string code UK ""  
		string phone  ""  
		string email  ""  
		string address  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	Department {
		string id PK ""  
		string tenant_id FK ""  
		string name  ""  
		string parent_id FK ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	User {
		string id PK ""  
		string tenant_id FK ""  
		string department_id FK ""  
		string username  ""  
		string password  ""  
		string email UK ""  
		boolean is_root  ""  
		enum status  ""  
		string avatar_url  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	AssetCategory {
		string id PK ""  
		string tenant_id FK ""  
		string name  ""  
		string code UK ""  
		string parent_id FK ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	AssetTemplate {
		string id PK ""  
		string tenant_id FK ""  
		string category_id FK ""  
		string code UK ""  
		string name  ""  
		string model  ""  
		string manufacturer  ""  
		string description  ""  
		string specifications  ""  
		decimal default_purchase_price  ""  
		int default_warranty_months  ""  
		boolean track_quantity  ""  
		int min_stock  ""  
		int max_stock  ""  
		boolean require_serial  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	AssetItem {
		string id PK ""  
		string tenant_id FK ""  
		string template_id FK ""  
		string code UK ""  
		string serial_number UK ""  
		datetime purchase_date  ""  
		decimal purchase_price  ""  
		decimal current_value  ""  
		enum status  ""  
		enum condition  ""  
		string location  ""  
		datetime warranty_start_date  ""  
		datetime warranty_end_date  ""  
		string created_by_user_id FK ""  
		string current_department_id FK ""  
		string current_user_id FK ""  
		string supplier_id FK ""  
		string purchase_order_id FK ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	MaintenanceSchedule {
		string id PK ""  
		string tenant_id FK ""  
		string asset_item_id FK ""  
		datetime date  ""  
		enum type  ""  
		enum status  ""  
		string description  ""  
		decimal estimated_cost  ""  
		decimal actual_cost  ""  
		string performed_by_user_id FK ""  
		string result  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
	}

	AssetTransfer {
		string id PK ""  
		string tenant_id FK ""  
		string asset_item_id FK ""  
		datetime transfer_date  ""  
		string from_department_id FK ""  
		string to_department_id FK ""  
		string from_user_id FK ""  
		string to_user_id FK ""  
		string reason  ""  
		enum status  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
	}

	AssetDisposal {
		string id PK ""  
		string asset_item_id FK ""  
		string tenant_id FK ""  
		datetime disposal_date  ""  
		enum disposal_type  ""  
		decimal disposal_value  ""  
		string reason  ""  
		string approved_by_user_id FK ""  
		enum status  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
	}

	InventoryItem {
		string id PK ""  
		string tenant_id FK ""  
		string category_id FK ""  
		string supplier_id FK ""  
		string sku UK ""  
		string name  ""  
		string description  ""  
		string unit  ""  
		int current_stock  ""  
		int min_stock  ""  
		int max_stock  ""  
		decimal unit_cost  ""  
		decimal total_value  ""  
		string storage_location  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	Supplier {
		string id PK ""  
		string tenant_id FK ""  
		string code UK ""  
		string name  ""  
		string phone  ""  
		string email  ""  
		string address  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
		datetime deleted_at  ""  
	}

	PurchaseOrder {
		string id PK ""  
		string tenant_id FK ""  
		string supplier_id FK ""  
		string po_number UK ""  
		datetime order_date  ""  
		decimal total_amount  ""  
		enum status  ""  
		string notes  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
	}

	BudgetPlan {
		string id PK ""  
		string tenant_id FK ""  
		string department_id FK ""  
		int fiscal_year  ""  
		decimal allocated_amount  ""  
		decimal spent_amount  ""  
		string notes  ""  
		datetime created_at  ""  
		datetime updated_at  ""  
	}

	AuditLog {
		string id PK ""  
		string tenant_id FK ""  
		string user_id FK ""  
		string action  ""  
		string entity_type  ""  
		string entity_id  ""  
		string old_value  ""  
		string new_value  ""  
		datetime action_time  ""  
	}

	Tenant||--o{Department:"has"
	Tenant||--o{User:"has"
	Tenant||--o{AssetCategory:"has"
	Tenant||--o{AssetTemplate:"has"
	Tenant||--o{AssetItem:"has"
	Tenant||--o{InventoryItem:"has"
	Tenant||--o{Supplier:"has"
	Tenant||--o{PurchaseOrder:"has"
	Tenant||--o{MaintenanceSchedule:"has"
	Tenant||--o{AssetTransfer:"has"
	Tenant||--o{AssetDisposal:"has"
	Tenant||--o{BudgetPlan:"has"
	Tenant||--o{AuditLog:"has"
	Department}o--||Tenant:"belongs_to"
	Department}o--o{Department:"parent_children"
	Department||--o{User:"has"
	Department||--o{AssetItem:"holds"
	Department||--o{BudgetPlan:"has"
	Department||--o{AssetTransfer:"transfers_from"
	Department||--o{AssetTransfer:"transfers_to"
	User}o--||Tenant:"belongs_to"
	User}o--||Department:"belongs_to"
	User||--o{AssetItem:"created"
	User||--o{AssetItem:"holds"
	User||--o{MaintenanceSchedule:"performed"
	User||--o{AssetDisposal:"approved"
	User||--o{AssetTransfer:"transfers_from"
	User||--o{AssetTransfer:"transfers_to"
	User||--o{AuditLog:"performed"
	AssetCategory}o--||Tenant:"belongs_to"
	AssetCategory}o--o{AssetCategory:"parent_children"
	AssetCategory||--o{AssetTemplate:"has"
	AssetCategory||--o{InventoryItem:"categorizes"
	AssetTemplate}o--||Tenant:"belongs_to"
	AssetTemplate}o--||AssetCategory:"belongs_to"
	AssetTemplate||--o{AssetItem:"instances"
	AssetItem}o--||Tenant:"belongs_to"
	AssetItem}o--||AssetTemplate:"template_of"
	AssetItem}o--||User:"created_by"
	AssetItem}o--||Department:"current_department"
	AssetItem}o--||User:"current_user"
	AssetItem}o--||Supplier:"supplied_by"
	AssetItem}o--||PurchaseOrder:"purchased_via"
	AssetItem||--o{MaintenanceSchedule:"has"
	AssetItem||--o{AssetTransfer:"transferred"
	AssetItem||--o{AssetDisposal:"disposed"
	MaintenanceSchedule}o--||Tenant:"belongs_to"
	MaintenanceSchedule}o--||AssetItem:"belongs_to"
	MaintenanceSchedule}o--||User:"performed_by"
	AssetTransfer}o--||Tenant:"belongs_to"
	AssetTransfer}o--||AssetItem:"transferred"
	AssetTransfer}o--||Department:"from_department"
	AssetTransfer}o--||Department:"to_department"
	AssetTransfer}o--||User:"from_user"
	AssetTransfer}o--||User:"to_user"
	AssetDisposal}o--||Tenant:"belongs_to"
	AssetDisposal}o--||AssetItem:"disposed"
	AssetDisposal}o--||User:"approved_by"
	InventoryItem}o--||Tenant:"belongs_to"
	InventoryItem}o--||AssetCategory:"categorized_by"
	InventoryItem}o--||Supplier:"supplied_by"
	Supplier}o--||Tenant:"belongs_to"
	Supplier||--o{AssetItem:"supplies"
	Supplier||--o{InventoryItem:"supplies"
	Supplier||--o{PurchaseOrder:"has"
	PurchaseOrder}o--||Tenant:"belongs_to"
	PurchaseOrder}o--||Supplier:"from"
	PurchaseOrder||--o{AssetItem:"contains"
	BudgetPlan}o--||Tenant:"belongs_to"
	BudgetPlan}o--||Department:"belongs_to"
	AuditLog}o--||Tenant:"belongs_to"
	AuditLog}o--||User:"performed_by"
```

## Key Design Patterns & Annotations

### 1. Multi-tenancy Foundation
- **Core Principle**: Every entity (except Tenant itself) includes a **tenant_id** foreign key
- **Data Isolation**: All queries automatically filter by tenant_id to prevent cross-tenant data access
- **Cascade Deletion**: When a Tenant is deleted, all related data is automatically removed
- **Unique Constraints**: Most unique constraints are scoped to tenant_id (e.g., department.name + tenant_id)

### 2. Soft Delete Implementation
- **Pattern**: `deleted_at` timestamp field instead of hard deletion
- **Entities with Soft Delete**: Tenant, Department, User, AssetCategory, AssetTemplate, AssetItem, InventoryItem, Supplier
- **Entities without Soft Delete**: MaintenanceSchedule, AssetTransfer, AssetDisposal, PurchaseOrder, BudgetPlan, AuditLog (these are historical/audit records)
- **Benefits**: Data recovery, audit trail preservation, referential integrity maintenance

### 3. Hierarchical Structures
- **Department Hierarchy**: Self-referencing `parent_id` for organizational tree structure
- **AssetCategory Hierarchy**: Self-referencing `parent_id` for classification taxonomy
- **Restrict Delete**: Parent entities cannot be deleted while children exist (onDelete: Restrict)
- **Use Case**: Organizational charts, nested asset classifications

### 4. Asset Lifecycle Management
- **Template → Item Pattern**: **AssetTemplate** defines specifications, **AssetItem** represents physical instances
- **Serial Tracking**: Optional `serial_number` for unique asset identification
- **Warranty Management**: `warranty_start_date` and `warranty_end_date` for service period tracking
- **Condition & Status**: Separate fields for physical condition (**AssetCondition**) and operational status (**AssetItemStatus**)

### 5. Relationship Annotations
- **Cascade Deletes**: 
  - Tenant → All related entities (complete cleanup)
  - AssetItem → MaintenanceSchedule, AssetTransfer, AssetDisposal (lifecycle cleanup)
- **Restrict Deletes**:
  - Department → Department (parent-child hierarchy)
  - AssetCategory → AssetCategory (parent-child hierarchy)
  - AssetTemplate → AssetCategory (template depends on category)
  - AssetItem → AssetTemplate (item depends on template)

### 6. Financial Tracking
- **Decimal Precision**: All monetary values use `@db.Decimal(19, 4)` for accurate financial calculations
- **Budget Management**: **BudgetPlan** tracks allocated vs spent amounts per department per fiscal year
- **Purchase Orders**: **PurchaseOrder** links suppliers to asset purchases with status tracking
- **Value Tracking**: **AssetItem** tracks both purchase price and current value for depreciation

### 7. Audit & Compliance
- **Comprehensive Logging**: **AuditLog** records all significant system actions
- **Change Tracking**: `old_value` and `new_value` fields capture data modifications
- **User Attribution**: Every audit record links to the user who performed the action
- **Entity Context**: `entity_type` and `entity_id` identify the affected record

### 8. Status Workflows
- **Multiple Status Enums**: Each entity has appropriate status enumerations (e.g., **AssetTransferStatus**, **PurchaseOrderStatus**)
- **Workflow Progression**: Status fields enable state machine patterns for approval workflows
- **Default Values**: Most status fields have sensible defaults (e.g., PENDING, ACTIVE)

### 9. Indexing Strategy
- **Primary Keys**: UUID `@id @default(uuid())` for all entities
- **Foreign Keys**: All relation fields are indexed for join performance
- **Composite Unique**: Tenant-scoped uniqueness (e.g., `@@unique([tenantId, code])`)
- **Natural Keys**: Business identifiers like `code`, `sku`, `po_number` with tenant scope

### 10. Timestamp Management
- **Automatic Timestamps**: `created_at` (default now) and `updated_at` (@updatedAt) on all entities
- **Soft Delete Marker**: `deleted_at` for non-destructive deletion
- **Action Timing**: **AuditLog** has `action_time` for precise event timestamping

## Design Considerations

### 1. Multi-tenant Data Isolation
- **Approach**: Row-level isolation via tenant_id foreign keys
- **Alternative**: Schema-per-tenant (not implemented, but possible with PostgreSQL)
- **Security**: Application-layer tenant validation required in addition to database constraints

### 2. Soft Delete vs Hard Delete
- **Soft Delete**: Used for master data (departments, users, assets)
- **Hard Delete**: Used for transactional/historical data (transfers, disposals, audits)
- **Rationale**: Master data needs recovery option, transactional data should be immutable

### 3. Hierarchy vs Flat Structures
- **Hierarchical**: Departments and AssetCategories use parent-child relationships
- **Flat**: Other entities use simple foreign key relationships
- **Performance**: Hierarchies may require recursive queries or materialized paths

### 4. Template Pattern for Assets
- **Advantage**: Centralized specification management
- **Trade-off**: Additional join required to get full asset details
- **Extension**: Could add versioning to templates for specification changes over time

### 5. Financial Decimal Precision
- **Standard**: 19 total digits, 4 decimal places (sufficient for most currencies)
- **Consideration**: May need adjustment for micro-transactions or very large values
- **Consistency**: Applied consistently across all monetary fields

## Query Performance Notes

1. **Tenant Filtering**: All queries should include `tenantId` in WHERE clause for performance
2. **Hierarchical Queries**: Department and AssetCategory hierarchies may require recursive CTEs
3. **Status-based Filtering**: Consider partial indexes on status fields for common queries
4. **Join Patterns**: AssetItem joins multiple tables (template, department, user, supplier) - consider denormalization for frequent access patterns

## Extension Points

1. **Additional Asset Attributes**: JSONB field could be added to AssetItem for flexible custom fields
2. **Document Attachment**: Could add separate Attachment entity with polymorphic relationships
3. **Notification System**: Could add Notification entity for alerts and reminders
4. **Role-Based Access**: Could extend User model with Role and Permission entities
5. **Location Hierarchy**: Could add dedicated Location entity with hierarchy support

This ERD represents a comprehensive asset management system with strong multi-tenant foundations, complete lifecycle tracking, and robust audit capabilities. The design balances normalization for data integrity with practical considerations for query performance and application development.