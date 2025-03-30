
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Publish from "./pages/Publish";
import Coins from "./pages/Coins";
import NotFound from "./pages/NotFound";
import StoryPage from "./pages/StoryPage";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route 
              path="/publish" 
              element={
                <AuthWrapper requireAuth>
                  <Publish />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/coins" 
              element={
                <AuthWrapper requireAuth>
                  <Coins />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AuthWrapper requireAuth>
                  <Profile />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/profile-setup" 
              element={
                <AuthWrapper requireAuth>
                  <ProfileSetup />
                </AuthWrapper>
              } 
            />
            <Route path="/story/:id" element={<StoryPage />} />
            <Route 
              path="/auth" 
              element={
                <AuthWrapper>
                  <Auth />
                </AuthWrapper>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
