import { PrismaClient } from 'generated/prisma/client';
import { randomUUID } from 'crypto';

export const seedDepartments = async (prisma: PrismaClient, orgId: string) => {
    // 7. Create default department
    const defaultDeptId = randomUUID();
    await prisma.department.upsert({
        where: {
            organizationId_name: {
                organizationId: orgId,
                name: 'Quản trị hệ thống',
            },
        },
        update: {},
        create: {
            id: defaultDeptId,
            organizationId: orgId,
            name: 'Quản trị hệ thống',
        },
    });
    console.log('Created default department');
};
