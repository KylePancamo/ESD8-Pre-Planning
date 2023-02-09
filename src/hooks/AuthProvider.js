import { useState, createContext, useContext, useMemo } from "react";
import { useNavigate }  from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children, response }) => {
    if (!response.data.username) {
        console.log(response.data);
    }
    const [user, setUser] = useState(response.data.username ? response.data.username : null);
    const navigate = useNavigate();

    const login = (username) => {
        setUser(username);
        navigate('/map');
    }

    // call this function to sign out logged in user
    const logout = () => {
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
          user,
          login,
          logout
        }),
        [user]
      );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};