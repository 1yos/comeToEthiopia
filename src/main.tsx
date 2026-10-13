import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// We own scroll position — disable browser restoration so our
// ScrollReset layout effects have full control.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)