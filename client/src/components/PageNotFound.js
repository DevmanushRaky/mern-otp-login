import React from 'react';

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! The page you are looking for might be under construction.</p>
       
      </div>
    </div>
  );
}
