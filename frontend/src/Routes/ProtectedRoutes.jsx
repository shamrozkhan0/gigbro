import { useAuth } from "../context/AuthContext"
import { Outlet, Navigate } from "react-router-dom"
import Loading from "../pages/Loading";


const ProtectedRoutes = () => {
    const { loading, isAuthenticated } = useAuth();
    if (loading) {
        return <Loading/>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />
}
export default ProtectedRoutes
