export type UserData = {
    id: number;
    username: string;
    password: string;
    permissions: number;
    iat: number;
    exp: number;
}

export type AuthContextValues = {
    userData: UserData | null;
    login: (decodedToken: UserData) => void;
    logout: () => void;
}