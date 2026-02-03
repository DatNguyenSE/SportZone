export type User = {
    id: string;
    userName?: string;
    fullName?: string;
    email: string;
    token: string;
    imageUrl?: string;
    roles: string[];
}

export type UserProfile = {
    id: string;
    userName?: string;
    fullName: string;
    email: string;
    token: string;
    imageUrl?: string;
    address?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
}

export type authenLoginCreds = {
    email: string;
    password: string;
    fullname: string;
}

export type authenResponse = {
    user: User;
    message: string;
    isNewUser : boolean;
}

export type RegisterCreds = {
    email: string;
    password: string;
    username: string
}
