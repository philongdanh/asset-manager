export interface JwtPayload {
    id: string;
    username: string;
    organizationId: string | null;
    isRoot: boolean;
    permissions: string[];
    iat?: number;
    exp?: number;
}
