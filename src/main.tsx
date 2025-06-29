// src/main.tsx

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

const root = createRoot(document.getElementById("root") !)
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
)

// Register service worker for PWA caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful:', registration)
      },
      (error) => {
        console.error('ServiceWorker registration failed:', error)
      }
    )
  })
}