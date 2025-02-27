
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 5000);

    // Animate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-[#1A1F2C] to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
              BETSTER
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-2 text-gray-300 font-medium"
          >
            Premium Betting Experience
          </motion.p>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5 }}
          className="w-64 h-1 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-full"
        />
        
        <div className="flex items-center justify-center mt-8">
          <Loader2 className="h-6 w-6 text-[#9b87f5] animate-spin mr-2" />
          <p className="text-gray-400 text-sm">{progress}% Loading</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
