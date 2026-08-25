import FullReport from "./components/reportTemplate/FullReport.jsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./Routes/ProtectedRoutes.jsx"
import ReportManager from "./pages/ReportManager.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import Waiting from "./components/Waiting.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Signup from "./components/Signup.jsx"
import NotFound from "./pages/NotFound.jsx"
import Login from "./components/Login.jsx"
import Auth from "./pages/Auth.jsx"
import "./App.css"

function App() {
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
            <Route path="/:username/analyze-report/:content_id" element={<Waiting/>}/>
            <Route path="/:username/report/:report_id" element={<ReportManager/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
