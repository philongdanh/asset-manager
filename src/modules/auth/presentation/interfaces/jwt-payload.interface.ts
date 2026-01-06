export interface JwtPayload {
    id: string;
    username: string;
    isRoot: boolean;
    permissions: string[];
    iat?: number;
    exp?: number;
}
