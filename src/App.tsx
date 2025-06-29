
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import Index from "./pages/Index";
import History from "./pages/History";
import Directory from "./pages/Directory";
import MemberProfile from "./pages/MemberProfile";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Map from "./pages/Map";
import MemberDashboard from "./pages/MemberDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import HallOfFame from "./pages/HallOfFame";
import NewsEvents from "./pages/NewsEvents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory/:id" element={<MemberProfile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/news-events" element={
              <ProtectedRoute requireSecretary>
                <NewsEvents />
              </ProtectedRoute>
            } />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/map" element={<Map />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pending-approval" element={<PendingAproval />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MemberDashboard />
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
          <PWAInstallBanner />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
