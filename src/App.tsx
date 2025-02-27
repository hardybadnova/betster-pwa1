
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import GameLobby from "./pages/GameLobby";
import CreateGame from "./pages/CreateGame";
import Game from "./pages/Game";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SplashScreen from "./components/SplashScreen";
import PoolSelection from "./pages/PoolSelection";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
              <Route path="/lobby" element={isAuthenticated ? <GameLobby /> : <Navigate to="/login" />} />
              <Route path="/pools" element={isAuthenticated ? <PoolSelection /> : <Navigate to="/login" />} />
              <Route path="/create" element={isAuthenticated ? <CreateGame /> : <Navigate to="/login" />} />
              <Route path="/game/:gameId" element={isAuthenticated ? <Game /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
