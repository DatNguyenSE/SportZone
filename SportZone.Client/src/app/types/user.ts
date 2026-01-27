export type User = {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?: string;
    roles: string[];
}

export type authenLoginCreds = {
    email: string;
    password: string;
    fullname: string;
}

export type RegisterCreds = {
    email: string;
    password: string;
    username: string
}

export type authenResponse = {
    user: User;
    message: string;
    isNewUser : boolean;
}