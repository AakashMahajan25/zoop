'use client';

import { useAuth } from '@/app/context/AuthContext';

export const SessionStatus = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg text-sm z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Session Active</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {user?.first_name} {user?.last_name}
      </div>
    </div>
  );
};
