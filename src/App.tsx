
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const History = lazy(() => import("./pages/History"));
const Directory = lazy(() => import("./pages/Directory"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const Contact = lazy(() => import("./pages/Contact"));
const News = lazy(() => import("./pages/News"));
const Map = lazy(() => import("./pages/Map"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard"));
const SecretaryDashboard = lazy(() => import("./pages/SecretaryDashboard"));
const HallOfFame = lazy(() => import("./pages/HallOfFame"));
const NewsEvents = lazy(() => import("./pages/NewsEvents"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/history" element={<History />} />
                <Route path="/hall-of-fame" element={<HallOfFame />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/guidelines" element={<Guidelines />} />
                
                {/* Protected routes for authenticated active members */}
                <Route path="/directory" element={
                  <ProtectedRoute>
                    <Directory />
                  </ProtectedRoute>
                } />
                <Route path="/directory/:id" element={
                  <ProtectedRoute>
                    <MemberProfile />
                  </ProtectedRoute>
                } />
                <Route path="/news" element={
                  <ProtectedRoute>
                    <News />
                  </ProtectedRoute>
                } />
                <Route path="/map" element={
                  <ProtectedRoute>
                    <Map />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MemberDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Secretary-only routes */}
                <Route path="/news-events" element={
                  <ProtectedRoute requireSecretary>
                    <NewsEvents />
                  </ProtectedRoute>
                } />
                <Route path="/secretary-dashboard" element={
                  <ProtectedRoute requireSecretary>
                    <SecretaryDashboard />
                  </ProtectedRoute>
                } />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <PWAInstallBanner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
