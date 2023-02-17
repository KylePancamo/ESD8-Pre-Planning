import { useState, createContext, useContext, useMemo } from "react";
import { useNavigate }  from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children, response }) => {
    if (!response.data.username) {
        console.log(response.data);
    }
    const [userData, setUserData] = useState(response.data ? response.data : null);
    const navigate = useNavigate();

    const login = (decodedToken) => {
        setUserData(decodedToken);
        navigate('/map');
    }

    // call this function to sign out logged in user
    const logout = () => {
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
          userData,
          login,
          logout
        }),
        [userData.username]
      );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};