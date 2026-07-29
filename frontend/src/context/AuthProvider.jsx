import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}me`;

    const checkAuthentication = useCallback(async () => {
        try {
            const response = await fetch(AUTH_URL, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();


            if (!data.success) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            setUser(data.user);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Authentication error:", error);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [AUTH_URL]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    return (
        <AuthContext.Provider
            value={{
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