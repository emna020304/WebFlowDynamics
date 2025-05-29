import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-ey-gray-800 text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-ey-yellow font-bold text-xl">EY Assessment</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-ey-yellow hover:bg-ey-yellow-dark text-ey-gray-800 px-4 py-2 rounded-md">
              New Assessment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}