import { useAuth } from "../context/AuthContext"
import { Outlet, Navigate } from "react-router-dom"


const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth()

    console.log("Protected Route Auth:", isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoutes
