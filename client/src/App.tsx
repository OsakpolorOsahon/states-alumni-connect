// src/App.tsx

import { Suspense, lazy } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { HelmetProvider } from 'react-helmet-async'
import ProtectedRoute from '@/components/ProtectedRoute'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import LoadingSpinner from '@/components/LoadingSpinner'

// lazy imports
const Index = lazy(() => import('./pages/Index'))
const About = lazy(() => import('./pages/About'))
const History = lazy(() => import('./pages/History'))
const Directory = lazy(() => import('./pages/Directory'))
const MemberProfile = lazy(() => import('./pages/MemberProfile'))
const SignUp = lazy(() => import('./pages/SignUp'))
const EmailVerification = lazy(() => import('./pages/EmailVerification'))
const UploadDocuments = lazy(() => import('./pages/UploadDocuments'))
const Login = lazy(() => import('./pages/Login'))
const PendingApproval = lazy(() => import('./pages/PendingApproval'))
const Contact = lazy(() => import('./pages/Contact'))
const News = lazy(() => import('./pages/News'))
const Map = lazy(() => import('./pages/Map'))
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'))
const SecretaryDashboard = lazy(() => import('./pages/SecretaryDashboard'))
const HallOfFame = lazy(() => import('./pages/HallOfFame'))
const NewsEvents = lazy(() => import('./pages/NewsEvents'))
const Jobs = lazy(() => import('./pages/Jobs'))
const Forum = lazy(() => import('./pages/Forum'))
const Mentorship = lazy(() => import('./pages/Mentorship'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Guidelines = lazy(() => import('./pages/Guidelines'))
const UserManual = lazy(() => import('./pages/UserManual'))
const NotFound = lazy(() => import('./pages/NotFound'))

const queryClient = new QueryClient()

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading page..." />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster />
          <Sonner />
          <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* public */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/hall-of-fame" element={<HallOfFame />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/guidelines" element={<Guidelines />} />
                  <Route path="/user-manual" element={<UserManual />} />

                  {/* auth flows */}
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/email-verification" element={<EmailVerification />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/pending-approval" element={<PendingApproval />} />

                  {/* post-signup upload documents - requires authentication but not active membership */}
                  <Route
                    path="/upload-documents"
                    element={
                      <ProtectedRoute>
                        <UploadDocuments />
                      </ProtectedRoute>
                    }
                  />

                  {/* Public directory */}
                  <Route path="/directory" element={<Directory />} />
                  
                  {/* member-only */}
                  <Route
                    path="/directory/:id"
                    element={
                      <ProtectedRoute>
                        <MemberProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/news"
                    element={
                      <ProtectedRoute>
                        <News />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <ProtectedRoute>
                        <Map />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MemberDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs"
                    element={
                      <ProtectedRoute>
                        <Jobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/forum"
                    element={
                      <ProtectedRoute>
                        <Forum />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mentorship"
                    element={
                      <ProtectedRoute>
                        <Mentorship />
                      </ProtectedRoute>
                    }
                  />

                  {/* secretary-only */}
                  <Route
                    path="/news-events"
                    element={
                      <ProtectedRoute requireSecretary>
                        <NewsEvents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/secretary-dashboard"
                    element={
                      <ProtectedRoute requireSecretary>
                        <SecretaryDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <PWAInstallBanner />
            </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}