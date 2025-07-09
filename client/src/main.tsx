
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)

// Enhanced PWA service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('ServiceWorker registration successful:', registration)
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              if (confirm('New version available! Reload to update?')) {
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.error('ServiceWorker registration failed:', error)
    }
  })

  // Listen for service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      window.location.reload()
    }
  })
}

// Register for push notifications if supported
if ('Notification' in window && 'serviceWorker' in navigator) {
  // Request notification permission
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted')
    }
  })
}
