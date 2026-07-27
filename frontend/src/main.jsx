import { NotificationProvider } from '../context/NotiificationProvider.jsx'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from '../context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <NotificationProvider>
            <App />
        </NotificationProvider>
    </AuthProvider>
)
