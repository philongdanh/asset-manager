# Cascade Delete Rules

```mermaid
---
config:
  theme: redux
  layout: elk
  themeVariables:
    fontFamily: EB Garamond
---
flowchart LR
 subgraph subGraph0["Direct Cascade from Tenant (onDelete: Cascade)"]
    direction LR
        Department["Department"]
        User["User"]
        AssetCategory["AssetCategory"]
        AssetTemplate["AssetTemplate"]
        AssetItem["AssetItem"]
        InventoryItem["InventoryItem"]
        Supplier["Supplier"]
        PurchaseOrder["PurchaseOrder"]
        MaintenanceSchedule["MaintenanceSchedule"]
        AssetTransfer["AssetTransfer"]
        AssetDisposal["AssetDisposal"]
        BudgetPlan["BudgetPlan"]
        AuditLog["AuditLog"]
  end
 subgraph subGraph1["Restrict Relationships (onDelete: Restrict)"]
    direction LR
        DepartmentParent["Department (Parent)"]
        DepartmentChild["Department (Child)"]
        CategoryParent["AssetCategory (Parent)"]
        CategoryChild["AssetCategory (Child)"]
        TemplateCategory["AssetTemplate -> AssetCategory"]
        ItemTemplate["AssetItem -> AssetTemplate"]
  end
 subgraph subGraph2["Cascade from AssetItem (onDelete: Cascade)"]
    direction LR
        Maintenance["MaintenanceSchedule"]
        Transfer["AssetTransfer"]
        Disposal["AssetDisposal"]
  end
    Tenant["Tenant<br>Deletion triggers cascade to all related entities"] --> Department & User & AssetCategory & AssetTemplate & AssetItem & InventoryItem & Supplier & PurchaseOrder & MaintenanceSchedule & AssetTransfer & AssetDisposal & BudgetPlan & AuditLog
    DepartmentParent -. Restrict .-> DepartmentChild
    CategoryParent -. Restrict .-> CategoryChild
    AssetTemplate -. Restrict .-> AssetCategory
    AssetItem -. Restrict .-> AssetTemplate
    AssetItem --> Maintenance & Transfer & Disposal
    Department -- Cascade to Users --> User
    Department -- Cascade to BudgetPlans --> BudgetPlan
    User -- Cascade to AuditLogs --> AuditLog
    Supplier -- Cascade to AssetItems --> AssetItem
    Supplier -- Cascade to InventoryItems --> InventoryItem
    PurchaseOrder -- Cascade to AssetItems --> AssetItem
```

## Complete Cascade Hierarchy

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
 subgraph subGraph0["First Level Cascade (Direct from Tenant)"]
        A1["Department"]
        A2["User"]
        A3["AssetCategory"]
        A4["AssetTemplate"]
        A5["AssetItem"]
        A6["InventoryItem"]
        A7["Supplier"]
        A8["PurchaseOrder"]
        A9["MaintenanceSchedule"]
        A10["AssetTransfer"]
        A11["AssetDisposal"]
        A12["BudgetPlan"]
        A13["AuditLog"]
  end
 subgraph subGraph1["Second Level Cascade (from AssetItem)"]
        B1["MaintenanceSchedule"]
        B2["AssetTransfer"]
        B3["AssetDisposal"]
  end
 subgraph subGraph2["Third Level Cascade (from Department)"]
        C1["User (via department)"]
        C2["BudgetPlan"]
        C3["AssetTransfer (from/to)"]
  end
 subgraph subGraph3["Fourth Level Cascade (from User)"]
        D1["AuditLog"]
  end
 subgraph subGraph4["Restrict Relationships (Block Deletion)"]
        R1["Department → Department (parent-child)"]
        R2["AssetCategory → AssetCategory (parent-child)"]
        R3["AssetTemplate → AssetCategory"]
        R4["AssetItem → AssetTemplate"]
  end
 subgraph Legend["Legend"]
        L1["Solid arrow = Cascade Delete"]
        L2["Dashed arrow = Restrict Delete"]
        L3["Thick border = Major entity"]
  end
    Tenant["Tenant<br>Deletion cascades to ALL entities"] ==> A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 & A10 & A11 & A12 & A13
    A5 ==> B1 & B2 & B3
    A1 ==> C1 & C2 & C3
    A2 ==> D1
    R1 -. RESTRICT .-> R1
    R2 -. RESTRICT .-> R2
    R3 -. RESTRICT .-> R3
    R4 -. RESTRICT .-> R4
```

## Cascade Delete Rules Summary

### 1. **Full Cascade from Tenant**
When a **tenant** is deleted, ALL related entities are automatically deleted:
- **department**, **user**, **asset_category**, **asset_template**, **asset_item**
- **inventory_item**, **supplier**, **purchase_order**
- **maintenance_schedule**, **asset_transfer**, **asset_disposal**
- **budget_plan**, **audit_log**

**Purpose**: Ensures complete data isolation and cleanup when an organization leaves the system.

### 2. **Cascade from AssetItem**
When an **asset_item** is deleted:
- All **maintenance_schedule** for that item are deleted
- All **asset_transfer** for that item are deleted
- All **asset_disposal** for that item are deleted

**Purpose**: Maintains referential integrity by removing dependent records when an asset is removed.

### 3. **Cascade from Department**
When a **department** is deleted:
- All **user** in that department are deleted (cascade from **tenant** relation)
- All **budget_plan** for that department are deleted
- **asset_transfer** records referencing the department are affected

**Purpose**: Ensures organizational structure changes are properly propagated.

### 4. **Restrict Relationships** (Prevent deletion)
The following relationships use **onDelete: Restrict** to prevent deletion:

1. **department hierarchy**: Cannot delete a department that has child departments
2. **asset_category hierarchy**: Cannot delete a category that has child categories
3. **asset_template → asset_category**: Cannot delete a category used by templates
4. **asset_item → asset_template**: Cannot delete a template used by items

**Purpose**: Prevents accidental deletion of hierarchical or referenced data, maintaining structural integrity.

### 5. **Important Notes**
- **onDelete: Cascade** means deletion automatically propagates to related entities
- **onDelete: Restrict** means deletion is blocked if related entities exist
- All foreign keys to **tenant** use Cascade for multi-tenant data isolation
- **asset_item** has cascade to its maintenance/transfer/disposal records
- Self-referencing hierarchies (**department**, **asset_category**) use Restrict to maintain structure

## Best Practices

### When to Use Cascade
1. **Parent-child relationships** where child data is meaningless without parent
2. **Audit/logging data** that should be cleaned up with the main entity
3. **Multi-tenant systems** where tenant deletion should remove all tenant data
4. **Dependent records** that exist only to support the main entity

### When to Use Restrict
1. **Hierarchical structures** where parent-child relationships must be maintained
2. **Reference data** that may be used by multiple entities
3. **Templates or categories** that define structure for other entities
4. **Historical records** that should be preserved even if related entities change

### Handling Restricted Deletions in Application Code
When a restrict constraint prevents deletion, the application should:

1. Check for existing relationships before attempting deletion
2. Provide clear error messages to users
3. Offer alternative actions (reassign, archive, or delete dependencies first)
4. Implement soft delete where appropriate instead of hard delete

## Common Scenarios

### Scenario 1: Deleting a Tenant
**Action**: Delete **tenant** record
**Result**: All related records across all tables are automatically deleted
**Use Case**: Organization closing their account

### Scenario 2: Deleting an Asset
**Action**: Delete **asset_item**
**Result**: **maintenance_schedule**, **asset_transfer**, and **asset_disposal** records for that asset are deleted
**Use Case**: Removing a defective or lost asset from the system

### Scenario 3: Attempting to delete a Category with Child Categories
**Action**: Delete **asset_category** that has children
**Result**: Deletion is blocked by database constraint
**Use Case**: Prevent breaking hierarchical classification system

### Scenario 4: Deleting a Department
**Action**: Delete **department**
**Result**: **user** and **budget_plan** are deleted; transfers referencing the department are affected
**Use Case**: Organizational restructuring

## Database-Level Constraints

### Foreign Key Constraints

| Parent Entity | Child Entity | Constraint Type | Description |
|--------------|--------------|-----------------|-------------|
| **tenant** | All entities | **Cascade** | Ensures complete tenant data removal |
| **asset_item** | **maintenance_schedule** | **Cascade** | Remove maintenance history |
| **asset_item** | **asset_transfer** | **Cascade** | Remove transfer history |
| **asset_item** | **asset_disposal** | **Cascade** | Remove disposal records |
| **department** | **department** (parent) | **Restrict** | Prevent orphaned hierarchy |
| **asset_category** | **asset_category** (parent) | **Restrict** | Maintain classification structure |
| **asset_template** | **asset_category** | **Restrict** | Preserve template categorization |
| **asset_item** | **asset_template** | **Restrict** | Maintain item-template relationship |

### Soft Delete Interaction
- **Soft delete** (via **deleted_at** field) is independent of cascade rules
- Cascade only triggers on **hard delete** operations
- **Soft deleted** records still participate in cascade relationships
- Applications should filter **deleted_at** IS NULL in queries

### Performance Considerations
1. **Large tenant deletions**: May cause performance issues due to multiple cascade operations
2. **Indexed foreign keys**: Ensure proper indexing for cascade operations
3. **Batch operations**: Consider breaking large deletions into batches
4. **Transaction management**: Use transactions for atomic cascade operations
