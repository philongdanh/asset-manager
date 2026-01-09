import { PrismaClient, Role, Tenant, User, UserStatus } from 'generated/client';

export const seedUsers = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  roles: Role[],
): Promise<User[]> => {
  console.log('Seeding users...');

  // Root user (no tenant)
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@system.com' },
    update: {},
    create: {
      id: 'user-root',
      username: 'root',
      password: '$2b$10$YourHashedPasswordHere', // In production, use proper hashing
      email: 'root@system.com',
      isRoot: true,
      status: UserStatus.ACTIVE,
      avatarUrl: '/avatars/root.png',
    },
  });

  const users: User[] = [rootUser];

  for (const tenant of tenants) {
    const tenantRoles = roles.filter((r) => r.tenantId === tenant.id);
    const adminRole = tenantRoles.find(
      (r) => r.name === 'System Administrator',
    );

    // Admin user for each tenant
    const adminUser = await prisma.user.upsert({
      where: { email: `admin@${tenant.code?.toLowerCase()}.com` },
      update: {},
      create: {
        id: `user-${tenant.id}-admin`,
        tenantId: tenant.id,
        username: `admin_${tenant.code?.toLowerCase()}`,
        password: '$2b$10$YourHashedPasswordHere',
        email: `admin@${tenant.code?.toLowerCase()}.com`,
        isRoot: false,
        status: UserStatus.ACTIVE,
        avatarUrl: '/avatars/admin.png',
      },
    });

    // Assign admin role
    if (adminRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: adminUser.id,
            roleId: adminRole.id,
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      });
    }

    // Regular users
    for (let i = 1; i <= 5; i++) {
      const user = await prisma.user.upsert({
        where: { email: `user${i}@${tenant.code?.toLowerCase()}.com` },
        update: {},
        create: {
          id: `user-${tenant.id}-${i}`,
          tenantId: tenant.id,
          username: `staff${i}_${tenant.code?.toLowerCase()}`,
          password: '$2b$10$YourHashedPasswordHere',
          email: `user${i}@${tenant.code?.toLowerCase()}.com`,
          isRoot: false,
          status: UserStatus.ACTIVE,
          avatarUrl: `/avatars/user${i}.png`,
        },
      });

      users.push(user);
    }
  }

  return users;
};
