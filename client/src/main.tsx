import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Authentication from './components/Context/Authentication.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Authentication>
          <App />
        </Authentication>
    </BrowserRouter>
  </StrictMode>,
)
