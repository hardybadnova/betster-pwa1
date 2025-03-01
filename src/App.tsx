
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { useState, useEffect } from "react";
import GameLobby from "./pages/GameLobby";
import Game from "./pages/Game";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SplashScreen from "./components/SplashScreen";
import PoolSelection from "./pages/PoolSelection";

// Add Firebase dependency
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD752_kcToWc2maZ1k17tLTr9cPXhAmbGc",
  authDomain: "betster-d7b42.firebaseapp.com",
  projectId: "betster-d7b42",
  storageBucket: "betster-d7b42.firebasestorage.app",
  messagingSenderId: "646284313493",
  appId: "1:646284313493:web:15475c95bef05a6dc9ec9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in with Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
      } else {
        // User is signed out
        localStorage.removeItem('isLoggedIn');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-black">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#9b87f5] border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
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
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/lobby" element={isAuthenticated ? <GameLobby /> : <Navigate to="/login" />} />
              <Route path="/pools" element={isAuthenticated ? <PoolSelection /> : <Navigate to="/login" />} />
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
