import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The coordinates or route you navigated to do not exist in the FoodBridge system.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home}>
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
