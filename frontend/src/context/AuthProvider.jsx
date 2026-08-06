import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}me`;

    const checkAuthentication = useCallback(async () => {
        try {
            const response = await fetch(AUTH_URL, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            setUser(data.user);
            setIsAuthenticated(true);
        } finally {
            setLoading(false);
        }
    }, [AUTH_URL]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    return (
        <AuthContext.Provider
    value={{
        loading,
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
        checkAuthentication
    }}
>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;