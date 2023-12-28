import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! The page you are looking for might be under construction.</p>
        <Link to="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
