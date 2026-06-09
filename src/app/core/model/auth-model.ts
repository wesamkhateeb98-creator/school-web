

export class AuthModel{
    id: number;
    token: string;
    expirationDate: Date;
    role: number;
    permission: Permission[];
    refreshToken: string;
    refreshTokenExpiry: Date;

    constructor(data: any) {
        this.id = data.id;
        this.token = data.token;
        this.expirationDate = new Date(data.expirationDate);
        this.role = data.role;
        this.permission = data.permission;
        this.refreshToken = data.refreshToken ?? '';
        this.refreshTokenExpiry = data.refreshTokenExpiry ? new Date(data.refreshTokenExpiry) : new Date(0);
    }

    isExpired(): boolean {
        return new Date() > this.expirationDate;
    }

    isRefreshTokenExpired(): boolean {
        return new Date() > this.refreshTokenExpiry;
    }
}

export enum Permission{
    READ = 0,
    WRITE = 1,
}
