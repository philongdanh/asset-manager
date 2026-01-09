import { Permission, PrismaClient, Role, Tenant } from 'generated/client';
import { ROLE_TEMPLATES } from '../data';

export const seedRoles = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  permissions: Permission[],
): Promise<Role[]> => {
  console.log('Seeding roles...');
  const roles: Role[] = [];

  for (const tenant of tenants) {
    for (const template of ROLE_TEMPLATES) {
      const roleId = `${tenant.id}-${template.suffix}`;
      const role = await prisma.role.upsert({
        where: { id: roleId },
        update: {},
        create: {
          id: roleId,
          tenantId: tenant.id,
          name: template.name,
          color: template.color,
        },
      });
      roles.push(role);

      // Assign permissions
      let permsToAssign: Permission[] = [];
      if (template.allPermissions) {
        permsToAssign = permissions;
      } else if (template.permissions) {
        permsToAssign = permissions.filter((p) =>
          template.permissions?.includes(p.name),
        );
      }

      for (const permission of permsToAssign) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }
  return roles;
};
