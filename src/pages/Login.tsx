
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User, KeyRound, AlertCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

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

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Betster',
      });
      
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // For demo purposes, allow login with test credentials
      if (email === 'test@betster.com' && password === 'password') {
        signInAnonymously(auth).then(() => {
          toast({
            title: 'Demo login successful',
            description: 'Welcome to Betster',
          });
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/dashboard');
        });
      } else {
        setError(error.message || 'Invalid credentials. Try test@betster.com/password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      toast({
        title: 'Demo login successful',
        description: 'Welcome to Betster',
      });
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to login with demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-black">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md p-8 backdrop-blur-lg border border-[#9b87f5]/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
              BETSTER
            </h1>
            <p className="mt-2 text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-center text-rose-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full bg-[#2A2E3A] border border-[#9b87f5]/20 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:border-transparent"
                  placeholder="Enter email (test@betster.com)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full bg-[#2A2E3A] border border-[#9b87f5]/20 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:border-transparent"
                  placeholder="Enter password (password)"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1F2C] text-gray-400">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#9b87f5]/20 rounded-md shadow-sm bg-[#2A2E3A] text-sm font-medium text-white hover:bg-[#2A2E3A]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] disabled:opacity-70"
              >
                Continue with Demo Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Betster. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
