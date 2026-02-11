import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/style.css'
import './styles/style-kids.css'
import './styles/animations.css'
import App from './App.jsx'

import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import { MockBackend } from './utils/MockBackend'

MockBackend.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </StrictMode>,
)

