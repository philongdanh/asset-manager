import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export const TENANT_ID_KEY = 'tenantId';
export const USER_ID_KEY = 'userId';
export const IS_ROOT_KEY = 'isRoot';

@Injectable()
export class TenantContextService {
    constructor(private readonly cls: ClsService) { }

    setTenantId(tenantId: string | undefined): void {
        this.cls.set(TENANT_ID_KEY, tenantId);
    }

    getTenantId(): string | undefined {
        return this.cls.get(TENANT_ID_KEY);
    }

    setUserId(userId: string): void {
        this.cls.set(USER_ID_KEY, userId);
    }

    getUserId(): string | undefined {
        return this.cls.get(USER_ID_KEY);
    }

    setIsRoot(isRoot: boolean): void {
        this.cls.set(IS_ROOT_KEY, isRoot);
    }

    getIsRoot(): boolean {
        return !!this.cls.get(IS_ROOT_KEY);
    }

    /**
     * Returns true if the query should be filtered by tenantId.
     * Root users might want to see everything unless a specific tenant is set.
     */
    shouldFilter(): boolean {
        const tenantId = this.getTenantId();
        const isRoot = this.getIsRoot();

        // If tenantId is set, we always filter.
        // If it's a root user and no tenantId is set, we don't filter.
        // If it's a normal user, tenantId should always be set (via interceptor).
        return !!tenantId;
    }
}
