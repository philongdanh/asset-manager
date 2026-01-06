import { PrismaClient } from 'generated/prisma/client';
import { randomUUID } from 'crypto';

export const seedPermissions = async (prisma: PrismaClient) => {
    // 2. Create System Permissions for all resources
    const resourcePermissions = [
        // Organization permissions
        { name: 'ORGANIZATION_VIEW', description: 'View organization details' },
        { name: 'ORGANIZATION_CREATE', description: 'Create organization' },
        { name: 'ORGANIZATION_UPDATE', description: 'Update organization' },
        { name: 'ORGANIZATION_DELETE', description: 'Delete organization' },

        // Department permissions
        { name: 'DEPARTMENT_VIEW', description: 'View departments' },
        { name: 'DEPARTMENT_CREATE', description: 'Create department' },
        { name: 'DEPARTMENT_UPDATE', description: 'Update department' },
        { name: 'DEPARTMENT_DELETE', description: 'Delete department' },

        // User permissions
        { name: 'USER_VIEW', description: 'View users' },
        { name: 'USER_CREATE', description: 'Create user' },
        { name: 'USER_UPDATE', description: 'Update user' },
        { name: 'USER_DELETE', description: 'Delete user' },

        // Asset Category permissions
        { name: 'ASSET_CATEGORY_VIEW', description: 'View asset categories' },
        { name: 'ASSET_CATEGORY_CREATE', description: 'Create asset category' },
        { name: 'ASSET_CATEGORY_UPDATE', description: 'Update asset category' },
        { name: 'ASSET_CATEGORY_DELETE', description: 'Delete asset category' },

        // Asset permissions
        { name: 'ASSET_VIEW', description: 'View assets' },
        { name: 'ASSET_CREATE', description: 'Create asset' },
        { name: 'ASSET_UPDATE', description: 'Update asset' },
        { name: 'ASSET_DELETE', description: 'Delete asset' },

        // Asset Depreciation permissions
        { name: 'DEPRECIATION_VIEW', description: 'View depreciations' },
        { name: 'DEPRECIATION_CREATE', description: 'Create depreciation' },
        { name: 'DEPRECIATION_UPDATE', description: 'Update depreciation' },
        { name: 'DEPRECIATION_DELETE', description: 'Delete depreciation' },

        // Maintenance Schedule permissions
        { name: 'MAINTENANCE_VIEW', description: 'View maintenance schedules' },
        { name: 'MAINTENANCE_CREATE', description: 'Create maintenance schedule' },
        { name: 'MAINTENANCE_UPDATE', description: 'Update maintenance schedule' },
        { name: 'MAINTENANCE_DELETE', description: 'Delete maintenance schedule' },

        // Asset Transfer permissions
        { name: 'TRANSFER_VIEW', description: 'View asset transfers' },
        { name: 'TRANSFER_CREATE', description: 'Create asset transfer' },
        { name: 'TRANSFER_UPDATE', description: 'Update asset transfer' },
        { name: 'TRANSFER_DELETE', description: 'Delete asset transfer' },
        { name: 'TRANSFER_APPROVE', description: 'Approve asset transfer' },

        // Asset Disposal permissions
        { name: 'DISPOSAL_VIEW', description: 'View asset disposals' },
        { name: 'DISPOSAL_CREATE', description: 'Create asset disposal' },
        { name: 'DISPOSAL_UPDATE', description: 'Update asset disposal' },
        { name: 'DISPOSAL_DELETE', description: 'Delete asset disposal' },
        { name: 'DISPOSAL_APPROVE', description: 'Approve asset disposal' },

        // Asset Document permissions
        { name: 'DOCUMENT_VIEW', description: 'View asset documents' },
        { name: 'DOCUMENT_CREATE', description: 'Create asset document' },
        { name: 'DOCUMENT_UPDATE', description: 'Update asset document' },
        { name: 'DOCUMENT_DELETE', description: 'Delete asset document' },

        // Inventory Check permissions
        { name: 'INVENTORY_VIEW', description: 'View inventory checks' },
        { name: 'INVENTORY_CREATE', description: 'Create inventory check' },
        { name: 'INVENTORY_UPDATE', description: 'Update inventory check' },
        { name: 'INVENTORY_DELETE', description: 'Delete inventory check' },

        // Inventory Detail permissions
        { name: 'INVENTORY_DETAIL_VIEW', description: 'View inventory details' },
        { name: 'INVENTORY_DETAIL_CREATE', description: 'Create inventory detail' },
        { name: 'INVENTORY_DETAIL_UPDATE', description: 'Update inventory detail' },
        { name: 'INVENTORY_DETAIL_DELETE', description: 'Delete inventory detail' },

        // Audit Log permissions
        { name: 'AUDIT_LOG_VIEW', description: 'View audit logs' },

        // Accounting Entry permissions
        { name: 'ACCOUNTING_VIEW', description: 'View accounting entries' },
        { name: 'ACCOUNTING_CREATE', description: 'Create accounting entry' },
        { name: 'ACCOUNTING_UPDATE', description: 'Update accounting entry' },
        { name: 'ACCOUNTING_DELETE', description: 'Delete accounting entry' },

        // Budget Plan permissions
        { name: 'BUDGET_VIEW', description: 'View budget plans' },
        { name: 'BUDGET_CREATE', description: 'Create budget plan' },
        { name: 'BUDGET_UPDATE', description: 'Update budget plan' },
        { name: 'BUDGET_DELETE', description: 'Delete budget plan' },

        // Role permissions
        { name: 'ROLE_VIEW', description: 'View roles' },
        { name: 'ROLE_CREATE', description: 'Create role' },
        { name: 'ROLE_UPDATE', description: 'Update role' },
        { name: 'ROLE_DELETE', description: 'Delete role' },

        // Permission management
        { name: 'PERMISSION_VIEW', description: 'View permissions' },

        // System permissions
        { name: 'SYSTEM_SETTINGS', description: 'Manage system settings' },
        { name: 'REPORT_VIEW', description: 'View all reports' },
        { name: 'DASHBOARD_VIEW', description: 'View dashboard' },
    ];

    const permissions = await Promise.all(
        resourcePermissions.map((p) =>
            prisma.permission.upsert({
                where: { name: p.name },
                update: {},
                create: {
                    id: randomUUID(),
                    name: p.name,
                    description: p.description,
                },
            }),
        ),
    );
    console.log(`Seeded ${permissions.length} permissions.`);
    return permissions;
};
