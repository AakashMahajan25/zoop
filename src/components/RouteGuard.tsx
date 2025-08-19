'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { getAuthToken } from '@/utils/api';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes (accessible without authentication)
  const publicRoutes = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/email-verified', '/profile-completion', '/pending-approval', '/upload-assessment'];
  
  // Define auth routes (should redirect to dashboard if already logged in)
  const authRoutes = ['/login', '/sign-up'];

  useEffect(() => {
    if (!isLoading && pathname) {
      const isPublicRoute = publicRoutes.includes(pathname);
      const isAuthRoute = authRoutes.includes(pathname);

      if (isAuthenticated && isAuthRoute) {
        // Logged in user trying to access login/signup - redirect to dashboard
        router.push('/dashboard');
        return;
      } else if (isAuthenticated && pathname === '/') {
        // Logged in user visiting root - redirect to dashboard
        router.push('/dashboard');
        return;
      } else if (!isAuthenticated && !isPublicRoute) {
        // Not logged in user trying to access protected route - redirect to login
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading while checking authentication
  // But don't show loading for auth routes if no token exists (first time visitors)
  if (isLoading) {
    const isAuthRoute = pathname ? authRoutes.includes(pathname) : false;
    const hasToken = typeof window !== 'undefined' && getAuthToken();
    
    // If it's an auth route and there's no token, don't show loading
    if (isAuthRoute && !hasToken) {
      return <>{children}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Validating session...</div>
      </div>
    );
  }

  // Don't render auth routes if user is authenticated
  const isAuthRoute = pathname ? authRoutes.includes(pathname) : false;
  if (isAuthenticated && isAuthRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Redirecting...</div>
      </div>
    );
  }

  // Don't render protected routes if user is not authenticated
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
};
