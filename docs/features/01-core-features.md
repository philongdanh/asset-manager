# Core Features

## 1. Multi-tenancy Architecture

### Complete Data Isolation
Every organization (tenant) operates in a completely isolated data environment with no risk of cross-tenant data leakage.

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    TenantA["Tenant A<br>Acme Corporation"] --> DataA["Tenant A Data<br>• Departments<br>• Users<br>• Assets<br>• Inventory<br>• Suppliers"]
    
    TenantB["Tenant B<br>Global Industries"] --> DataB["Tenant B Data<br>• Departments<br>• Users<br>• Assets<br>• Inventory<br>• Suppliers"]
    
    TenantC["Tenant C<br>Tech Solutions Ltd"] --> DataC["Tenant C Data<br>• Departments<br>• Users<br>• Assets<br>• Inventory<br>• Suppliers"]
    
    classDef tenant fill:#e3f2fd,stroke:#1976d2
    classDef data fill:#f3e5f5,stroke:#7b1fa2
    
    class TenantA,TenantB,TenantC tenant
    class DataA,DataB,DataC data
```

### Key Features
- **Row-level isolation**: All database queries automatically filter by `tenant_id`
- **Independent configurations**: Each tenant can have custom settings and preferences
- **Scalable architecture**: Support for thousands of independent organizations
- **Complete data cleanup**: Tenant deletion removes all associated data through cascade rules

## 2. Organization Structure Management

### Department Hierarchy
Flexible organizational structure with unlimited nesting levels.

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    CEO["CEO Office"]
    
    subgraph Engineering["Engineering Division"]
        EngVP["VP Engineering"]
        
        subgraph Backend["Backend Department"]
            BE1["Team Alpha<br>10 users"]
            BE2["Team Beta<br>8 users"]
        end
        
        subgraph Frontend["Frontend Department"]
            FE1["React Team<br>6 users"]
            FE2["Angular Team<br>5 users"]
        end
        
        subgraph DevOps["DevOps Department"]
            DO1["Infrastructure<br>4 users"]
            DO2["Deployment<br>3 users"]
        end
    end
    
    subgraph Sales["Sales Division"]
        SalesVP["VP Sales"]
        SalesTeam1["Enterprise Sales<br>12 users"]
        SalesTeam2["SMB Sales<br>8 users"]
    end
    
    subgraph Finance["Finance Division"]
        FinanceVP["VP Finance"]
        Accounting["Accounting<br>6 users"]
        Budgeting["Budget Planning<br>4 users"]
    end
    
    CEO --> Engineering & Sales & Finance
    EngVP --> Backend & Frontend & DevOps
    SalesVP --> SalesTeam1 & SalesTeam2
    FinanceVP --> Accounting & Budgeting
    
    classDef level1 fill:#e8f5e9,stroke:#388e3c
    classDef level2 fill:#e3f2fd,stroke:#1976d2
    classDef level3 fill:#f3e5f5,stroke:#7b1fa2
    classDef level4 fill:#fff3e0,stroke:#f57c00
    
    class CEO level1
    class Engineering,Sales,Finance,EngVP,SalesVP,FinanceVP level2
    class Backend,Frontend,DevOps,SalesTeam1,SalesTeam2,Accounting,Budgeting level3
    class BE1,BE2,FE1,FE2,DO1,DO2 level4
```

### Features
- **Unlimited nesting**: Create complex organizational hierarchies
- **Parent-child relationships**: Maintain reporting structures
- **Budget allocation**: Assign budgets at any department level
- **Asset assignment**: Track assets by department and user
- **Soft delete support**: Archive departments without losing history

### Department Management Table
| Feature | Description | Use Case |
|---------|-------------|----------|
| **Hierarchy Management** | Create, update, and reorganize department structures | Company restructuring, team expansion |
| **Budget Assignment** | Allocate budgets to departments for asset procurement | Financial planning, expense tracking |
| **User Assignment** | Assign users to departments with role-based access | Employee onboarding, team management |
| **Asset Tracking** | Monitor assets assigned to specific departments | Inventory management, cost allocation |
| **Reporting Structure** | Define reporting lines and hierarchies | Organizational planning, workflow design |

## 3. User Management & Authentication

### User Roles and Permissions
The system implements a simple role-based access control through user status and root user flag.

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    UserTypes["User Types"] --> RootUser["Root User<br>is_root = true"]
    UserTypes --> TenantUser["Tenant User<br>is_root = false"]
    
    RootUser --> RootCapabilities["Root Capabilities"]
    TenantUser --> UserStatus["User Status"]
    
    subgraph RootCapabilities["Root User Capabilities"]
        RC1["Cross-tenant management"]
        RC2["System configuration"]
        RC3["Tenant creation/deletion"]
        RC4["Global user management"]
    end
    
    subgraph UserStatus["Tenant User Status"]
        direction LR
        Active["ACTIVE<br>Full system access"]
        Inactive["INACTIVE<br>No system access"]
    end
    
    TenantUser --> DepartmentAssignment["Department Assignment"]
    DepartmentAssignment --> DA1["Asset management<br>within department"]
    DepartmentAssignment --> DA2["Budget viewing<br>for assigned department"]
    DepartmentAssignment --> DA3["User management<br>within department"]
    
    classDef root fill:#ffebee,stroke:#d32f2f
    classDef tenant fill:#e3f2fd,stroke:#1976d2
    classDef capability fill:#f3e5f5,stroke:#7b1fa2
    classDef status fill:#e8f5e9,stroke:#388e3c
    
    class RootUser root
    class TenantUser tenant
    class RootCapabilities,DepartmentAssignment capability
    class Active,Inactive status
```

### Authentication Flow

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
sequenceDiagram
    participant User
    participant Frontend
    participant AuthService
    participant Database
    participant AuditLog
    
    User->>Frontend: Enter credentials
    Frontend->>AuthService: POST /auth/login
    AuthService->>Database: Validate user credentials
    Database-->>AuthService: User record + tenant info
    
    alt Valid Credentials
        AuthService->>AuthService: Generate JWT tokens
        AuthService->>AuditLog: Log login success
        AuthService-->>Frontend: {accessToken, refreshToken, userData}
        Frontend-->>User: Redirect to dashboard
    else Invalid Credentials
        AuthService->>AuditLog: Log login failure
        AuthService-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show error message
    end
    
    Note over User,AuditLog: Subsequent API requests
    User->>Frontend: Request asset data
    Frontend->>AuthService: API call with accessToken
    AuthService->>AuthService: Verify token & tenant context
    AuthService->>Database: Query with tenant_id filter
    Database-->>AuthService: Tenant-scoped data
    AuthService-->>Frontend: Filtered response
    Frontend-->>User: Display data
```

### User Management Features

#### User Status Management
| Status | Description | Actions Allowed |
|--------|-------------|-----------------|
| **ACTIVE** | User can log in and perform assigned tasks | Full access based on department assignment |
| **INACTIVE** | Account disabled, cannot log in | No system access |

#### Profile Management
- **Personal information**: Username, email
- **Department assignment**: Link to organizational structure
- **Root user flag**: System-wide administrative access
- **Password management**: Secure credential storage

#### Security Features
- **JWT-based authentication**: Stateless authentication with access and refresh tokens
- **Password encryption**: BCrypt hashing for password security
- **Tenant validation**: All requests validated against user's tenant context
- **Audit logging**: All authentication events recorded in audit_log table

## 4. Root User Administration

### System Administration Capabilities
Root users (`is_root = true`) have cross-tenant administration privileges.

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart LR
    RootUser["Root Administrator"] --> TenantMgmt["Tenant Management"]
    RootUser --> UserMgmt["User Management"]
    RootUser --> SystemView["System View"]
    
    TenantMgmt --> TM1["Create New Tenants"]
    TenantMgmt --> TM2["View All Tenants"]
    TenantMgmt --> TM3["Manage Tenant Status"]
    TenantMgmt --> TM4["Delete Tenants"]
    
    UserMgmt --> UM1["View All Users"]
    UserMgmt --> UM2["Manage Root Access"]
    UserMgmt --> UM3["Reset Passwords"]
    UserMgmt --> UM4["Impersonate Users"]
    
    SystemView --> SV1["System-wide Reports"]
    SystemView --> SV2["Audit Logs"]
    SystemView --> SV3["Performance Metrics"]
    
    classDef root fill:#ffebee,stroke:#d32f2f
    classDef category fill:#e3f2fd,stroke:#1976d2
    classDef feature fill:#f3e5f5,stroke:#7b1fa2
    
    class RootUser root
    class TenantMgmt,UserMgmt,SystemView category
    class TM1,TM2,TM3,TM4,UM1,UM2,UM3,UM4,SV1,SV2,SV3 feature
```

### Root User Access Control
| Module | Root Access | Tenant User Access |
|--------|------------|-------------------|
| **Tenant Management** | Full access (create, read, update, delete) | No access |
| **User Management** | View all users across tenants | Only users within own tenant |
| **Asset Management** | View assets across all tenants | Only assets within own tenant |
| **Audit Logs** | View all system logs | Only logs within own tenant |
| **System Configuration** | Full access | No access |

## 5. Audit & Compliance

### Comprehensive Activity Tracking
Every significant action in the system is logged in the `audit_log` table.

#### Audit Log Structure
| Field | Type | Description |
|-------|------|-------------|
| **id** | UUID | Unique identifier |
| **tenant_id** | UUID | Tenant context |
| **user_id** | UUID | User who performed action |
| **action** | String | Type of operation (CREATE, UPDATE, DELETE, LOGIN) |
| **entity_type** | String | Affected entity (User, AssetItem, Department) |
| **entity_id** | String | Specific record identifier |
| **old_value** | String (JSON) | Previous state before change |
| **new_value** | String (JSON) | New state after change |
| **action_time** | DateTime | Timestamp of action |

### Audit Scenarios

```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
sequenceDiagram
    participant User
    participant API
    participant BusinessLogic
    participant Database
    participant AuditService
    
    User->>API: Update asset status
    API->>BusinessLogic: Process update request
    BusinessLogic->>Database: Get current asset data
    Database-->>BusinessLogic: Current asset state
    
    BusinessLogic->>AuditService: Prepare audit data
    Note over BusinessLogic: Capture old_value
    
    BusinessLogic->>Database: Update asset record
    Database-->>BusinessLogic: Update confirmation
    
    BusinessLogic->>AuditService: Complete audit record
    Note over BusinessLogic: Add new_value, user_id, timestamp
    
    AuditService->>Database: Save audit log
    Database-->>AuditService: Log saved
    
    BusinessLogic-->>API: Success response
    API-->>User: Update confirmed
```

### Compliance Features
- **Complete audit trail**: Every data modification tracked
- **User accountability**: All actions linked to specific user
- **Data integrity**: Before/after values captured for all changes
- **Tenant isolation**: Each tenant sees only their own audit logs
- **Immutable records**: Audit logs cannot be modified or deleted

## 6. Data Management & Integrity

### Soft Delete Implementation
Strategic use of soft deletes via **deleted_at** timestamp field.

```mermaid
---
config:
  layout: elk
  theme: redux-color
  themeVariables:
    fontFamily: EB Garamond
---
stateDiagram-v2
    [*] --> Active
    Active --> SoftDeleted : Set deleted_at = now()
    SoftDeleted --> Active : Set deleted_at = NULL
    SoftDeleted --> [*] : Hard delete (cascade)
    
    note right of Active
        **Active Records**
        • deleted_at IS NULL
        • Appear in all queries
        • Can be modified
        • Participate in relationships
    end note
    
    note right of SoftDeleted
        **Soft Deleted Records**
        • deleted_at = timestamp
        • Filtered from normal queries
        • Read-only in application
        • Maintain referential integrity
    end note
```

### Entities with Soft Delete
| Entity | Soft Delete Field | Cascade Behavior |
|--------|------------------|------------------|
| **Tenant** | deleted_at | Cascade delete to all related entities |
| **Department** | deleted_at | Restricted if has children or users |
| **User** | deleted_at | Cascade from tenant, restrict from department |
| **AssetCategory** | deleted_at | Restricted if has children or templates |
| **AssetTemplate** | deleted_at | Restricted if has asset items |
| **AssetItem** | deleted_at | Cascade to maintenance, transfers, disposals |
| **InventoryItem** | deleted_at | No cascade dependencies |
| **Supplier** | deleted_at | No cascade dependencies |

### Entities without Soft Delete
| Entity | Reason |
|--------|--------|
| **MaintenanceSchedule** | Historical records should be immutable |
| **AssetTransfer** | Transfer history must be preserved |
| **AssetDisposal** | Disposal records are final |
| **PurchaseOrder** | Financial records cannot be deleted |
| **BudgetPlan** | Financial planning history |
| **AuditLog** | Audit trail must be tamper-proof |

## 7. Cascade Delete Rules

### Two-Level Cascade Hierarchy
```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    Tenant["Tenant"] -- Cascade --> L1["All Entities"]
    
    subgraph L1["Level 1: Direct Tenant Cascade"]
        Department
        User
        AssetCategory
        AssetTemplate
        AssetItem
        InventoryItem
        Supplier
        PurchaseOrder
        MaintenanceSchedule
        AssetTransfer
        AssetDisposal
        BudgetPlan
        AuditLog
    end
    
    AssetItem -- Cascade --> L2["Level 2: AssetItem Dependencies"]
    
    subgraph L2["Level 2: AssetItem Cascade"]
        Maintenance["MaintenanceSchedule"]
        Transfer["AssetTransfer"]
        Disposal["AssetDisposal"]
    end
    
    classDef tenant fill:#e8f5e8,stroke:#388e3c
    classDef cascade fill:#e3f2fd,stroke:#1976d2
    
    class Tenant tenant
    class Department,User,AssetCategory,AssetTemplate,AssetItem,InventoryItem,Supplier,PurchaseOrder,MaintenanceSchedule,AssetTransfer,AssetDisposal,BudgetPlan,AuditLog,Maintenance,Transfer,Disposal cascade
```

### Restricted Deletions
| Relationship | Constraint | Reason |
|--------------|------------|--------|
| **Department → Department** | RESTRICT | Cannot delete department with child departments |
| **AssetCategory → AssetCategory** | RESTRICT | Cannot delete category with child categories |
| **AssetTemplate → AssetCategory** | RESTRICT | Cannot delete category used by templates |
| **AssetItem → AssetTemplate** | RESTRICT | Cannot delete template used by items |

## 8. Module Structure (NestJS)

### Standard Module Architecture
```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    AppModule["AppModule"] --> SharedModules["Shared Modules"]
    AppModule --> FeatureModules["Feature Modules"]
    
    subgraph SharedModules["Shared Modules"]
        DatabaseModule["DatabaseModule<br>(Prisma)"]
        AuthModule["AuthModule<br>(JWT, Guards)"]
        CommonModule["CommonModule<br>(Filters, Pipes)"]
    end
    
    subgraph FeatureModules["Feature Modules"]
        TenantModule["TenantModule"]
        DepartmentModule["DepartmentModule"]
        UserModule["UserModule"]
        AssetCategoryModule["AssetCategoryModule"]
        AssetTemplateModule["AssetTemplateModule"]
        AssetItemModule["AssetItemModule"]
        MaintenanceModule["MaintenanceModule"]
        TransferModule["TransferModule"]
        DisposalModule["DisposalModule"]
        InventoryModule["InventoryModule"]
        SupplierModule["SupplierModule"]
        PurchaseOrderModule["PurchaseOrderModule"]
        BudgetModule["BudgetModule"]
        AuditModule["AuditModule"]
    end
    
    SharedModules --> FeatureModules
    
    classDef app fill:#e8f5e8,stroke:#388e3c
    classDef shared fill:#e3f2fd,stroke:#1976d2
    classDef feature fill:#f3e5f5,stroke:#7b1fa2
    
    class AppModule app
    class DatabaseModule,AuthModule,CommonModule shared
    class TenantModule,DepartmentModule,UserModule,AssetCategoryModule,AssetTemplateModule,AssetItemModule,MaintenanceModule,TransferModule,DisposalModule,InventoryModule,SupplierModule,PurchaseOrderModule,BudgetModule,AuditModule feature
```

### Module Responsibilities
| Module | Database Model | API Endpoints |
|--------|---------------|---------------|
| **TenantModule** | Tenant | CRUD, status management |
| **DepartmentModule** | Department | CRUD, hierarchy management |
| **UserModule** | User | CRUD, authentication, profile |
| **AssetCategoryModule** | AssetCategory | CRUD, hierarchy management |
| **AssetTemplateModule** | AssetTemplate | CRUD, specifications |
| **AssetItemModule** | AssetItem | CRUD, tracking, assignment |
| **MaintenanceModule** | MaintenanceSchedule | CRUD, scheduling, tracking |
| **TransferModule** | AssetTransfer | CRUD, approval workflows |
| **DisposalModule** | AssetDisposal | CRUD, approval workflows |
| **InventoryModule** | InventoryItem | CRUD, stock management |
| **SupplierModule** | Supplier | CRUD, vendor management |
| **PurchaseOrderModule** | PurchaseOrder | CRUD, procurement workflows |
| **BudgetModule** | BudgetPlan | CRUD, financial tracking |
| **AuditModule** | AuditLog | Read-only, reporting |

## 9. Security Implementation

### Multi-layer Security
```mermaid
---
config:
  layout: elk
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart TB
    Request["HTTP Request"] --> AuthGuard["Authentication Guard"]
    AuthGuard --> TenantGuard["Tenant Guard"]
    TenantGuard --> RoleGuard["Authorization Guard"]
    RoleGuard --> Controller["Controller Method"]
    Controller --> Service["Business Logic"]
    Service --> Repository["Database Access"]
    
    AuthGuard --> VerifyToken["Verify JWT Token"]
    VerifyToken --> ValidateUser["Validate User Exists"]
    ValidateUser --> CheckStatus["Check User Status"]
    
    TenantGuard --> ExtractTenant["Extract tenant_id"]
    ExtractTenant --> ValidateTenant["Validate Tenant Access"]
    
    RoleGuard --> CheckPermissions["Check User Permissions"]
    CheckPermissions --> ValidateDepartment["Validate Department Access"]
    
    classDef guard fill:#fff3e0,stroke:#f57c00
    classDef process fill:#e3f2fd,stroke:#1976d2
    
    class AuthGuard,TenantGuard,RoleGuard guard
    class VerifyToken,ValidateUser,CheckStatus,ExtractTenant,ValidateTenant,CheckPermissions,ValidateDepartment process
```

### Security Features
- **JWT authentication**: Access and refresh token strategy
- **Tenant isolation**: All queries filtered by tenant_id
- **User status validation**: Only ACTIVE users can access system
- **Department scoping**: Users access only their department's data
- **Input validation**: Class-validator decorators on all DTOs
- **SQL injection prevention**: Prisma parameterized queries
- **Password hashing**: BCrypt with configurable rounds

## Key Benefits Summary

### For System Administrators (Root Users)
- **Centralized management**: Manage multiple tenants from single interface
- **Complete audit trail**: Visibility into all system activities
- **Data isolation**: Confidence in tenant data separation
- **Simple role model**: Clear distinction between root and tenant users

### For Tenant Administrators
- **Full tenant control**: Complete management of organization structure
- **User management**: Create and manage users within tenant
- **Department hierarchy**: Flexible organizational structure
- **Asset lifecycle tracking**: Complete visibility into asset utilization

### For End Users
- **Simple interface**: Easy-to-use system for daily operations
- **Department-based access**: See only relevant data
- **Asset tracking**: Easy management of assigned assets
- **Maintenance scheduling**: Simple request and tracking system

### Technical Benefits
- **Modular architecture**: Clean separation of concerns with NestJS modules
- **Database integrity**: Cascade and restrict rules maintain data consistency
- **Performance**: Efficient queries with proper indexing
- **Maintainability**: Clear structure with Prisma schema as single source of truth