import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unauthorized</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </Link>
            
            <Link 
              to="/" 
              className="w-full text-blue-500 hover:text-blue-600"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
