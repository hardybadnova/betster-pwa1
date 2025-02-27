
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1A1F2C] to-black p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-[#9b87f5]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#9b87f5] text-white rounded-md font-medium hover:bg-[#8a76e4] transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-md font-medium hover:bg-[#9b87f5]/10 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
