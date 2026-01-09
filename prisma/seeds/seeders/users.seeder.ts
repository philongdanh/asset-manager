import { PrismaClient, Role, Tenant, User, UserStatus } from 'generated/client';
import { REALISTIC_USERS } from '../data';

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

    // Realistic users
    for (const userData of REALISTIC_USERS) {
      const emailDomain = tenant.code?.toLowerCase() + '.com';
      const email = `${userData.username}@${emailDomain}`;

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          id: `user-${tenant.id}-${userData.username}`,
          tenantId: tenant.id,
          username: `${userData.username}_${tenant.code?.toLowerCase()}`,
          password: '$2b$10$YourHashedPasswordHere',
          email,
          isRoot: false,
          status: UserStatus.ACTIVE,
          avatarUrl: `/avatars/${userData.username}.png`,
        },
      });

      users.push(user);
    }
  }

  return users;
};
