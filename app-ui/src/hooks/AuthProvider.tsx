import { useState, createContext, useContext, useMemo } from "react";
import { useNavigate }  from 'react-router-dom';
import { UserData, AuthContextValues } from "../types/auth-types";

const AuthContext = createContext<AuthContextValues>({
    userData: null,
    login: (decodedToken: UserData) => {},
    logout: () => {}
});

type AuthProviderProps = {
    children: React.ReactNode;
    response: { data: UserData } | null;
}

export const AuthProvider = ({ children, response } : AuthProviderProps) => {

    const [userData, setUserData] = useState<UserData | null>(response?.data ?? null);
    const navigate = useNavigate();

    const login = (decodedToken: UserData) => {
        setUserData(decodedToken);
        navigate('/map');
    }

    // call this function to sign out logged in user
    const logout = () => {
        setUserData(null);
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
          userData,
          login,
          logout
        }),
        [userData?.username]
      );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};