import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AudioProvider } from './lib/audio'
import { ProgressProvider } from './lib/progress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ProgressProvider>
  </StrictMode>,
)
