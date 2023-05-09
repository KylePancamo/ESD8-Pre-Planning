import { useState, createContext, useContext, useMemo } from "react";
import { useNavigate }  from 'react-router-dom';
import { UserData, AuthContextValues } from "../types/auth-types";

// Creates a context for user authentication
const AuthContext = createContext<AuthContextValues>({
    userData: null,
    login: (decodedToken: UserData) => {},
    logout: () => {}
});

type AuthProviderProps = {
    children: React.ReactNode;
    response: { data: UserData } | null;
}

// Defines the AuthProvider component which manages the user authentication state
export const AuthProvider = ({ children, response } : AuthProviderProps) => {

    const [userData, setUserData] = useState<UserData | null>(response?.data ?? null);
    const navigate = useNavigate();

    // Function to sign out the authenticated user
    const login = (decodedToken: UserData) => {
        setUserData(decodedToken);
        navigate('/map');
    }

    // call this function to sign out logged in user
    const logout = () => {
        setUserData(null);
        navigate("/", { replace: true });
    };

    // Memoize the authentication state values to optimize performance
    const value = useMemo(
        () => ({
          userData,
          login,
          logout
        }),
        [userData?.username]
      );

    // Wrap the AuthContext Provider around the child components to manage the authentication state
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to access the AuthContext values
export const useAuth = () => {
    return useContext(AuthContext);
};