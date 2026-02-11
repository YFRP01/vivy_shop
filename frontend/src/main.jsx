import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {NotificationProvider} from '../components/context/NotificationsContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>   
      <NotificationProvider> 
        <App />
      </NotificationProvider>
    </BrowserRouter>
)
