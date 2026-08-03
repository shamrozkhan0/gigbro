import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./Routes/ProtectedRoutes.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Signup from "./components/Signup.jsx"
import Login from "./components/Login.jsx"
import Auth from "./pages/Auth.jsx"
import "./App.css"
import NotFound from "./pages/NotFound.jsx"
import { useAuth } from "./context/AuthContext.jsx" 

function App() {
  const { isAuthenticated, user } = useAuth();
  console.log("ProtectedRoute", {
  isAuthenticated,
  user,
});
  return (
    <>
      <BrowserRouter>
        <Routes>         
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboarddemo" element={<Dashboard/>} />
          <Route path="*" element={<NotFound/>}/> 
          
          {/* Authentication Routes contains Login and Signup pages */}
          <Route element={<Auth/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Private routes only accessable when user is authenticated */}
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
