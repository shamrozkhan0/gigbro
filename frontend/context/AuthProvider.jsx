import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}me`;

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(AUTH_URL, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }

                const data = await response.json();

                console.log("Authenticated user:", data);

                setUser(data);
                setIsAuthenticated(true);

            } catch (error) {
                console.error("Authentication error:", error);

                setIsAuthenticated(false);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;