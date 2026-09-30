import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// GSAP is registered once here via side-effect import
import '@/lib/gsapSetup'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
