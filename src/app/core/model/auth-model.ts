

export class AuthModel{
    id: number;
    token: string;
    expirationDate: Date;
    role: number;
    permission: Permission[];

    constructor(data: any) {
        this.id = data.id;
        this.token = data.token;
        this.expirationDate = new Date(data.expirationDate);
        this.role = data.role;
        this.permission = data.permission;
    }

    isExpired(): boolean {
        return new Date() > this.expirationDate;
    }
}

export enum Permission{
    READ = 0,
    WRITE = 1,
}
