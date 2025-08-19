'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  loginUser, 
  registerUser, 
  forgotPassword, 
  resetPassword, 
  logoutUser,
  getAuthToken, 
  setAuthToken, 
  removeAuthToken,
  authenticatedApiCall,
  validateToken,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type LoginResponse,
  type RegisterResponse,
  type ApiResponse
} from '@/utils/api';
import { getContextualErrorMessage } from '@/utils/errorMessages';

export interface User {
  id: number;
  email: string;
  role_id: number;
  first_name: string;
  last_name: string;
  status: string;
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordRequest) => Promise<boolean>;
  clearError: () => void;
  
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Logout function with API call
  const logout = useCallback(async () => {
    // Call logout API and handle response
    if (user) {
      try {
        await logoutUser();
      } catch (error) {
        // Continue with logout even if API fails
      }
    }
    
    // Always clear local state and redirect regardless of API response
    removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router, user]);

  // Validate current session
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return false;
      }

      // Validate token with backend
      const isValid = await validateToken(token);
      return isValid;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, []);

  // Initialize authentication on mount
  const initializeAuth = useCallback(() => {
    try {
      const token = getAuthToken();
      if (token) {
        // For now, trust local storage since backend validation endpoint doesn't exist
        const userData = localStorage.getItem('user');
        if (userData) {
          console.log('Loading user from localStorage:', JSON.parse(userData));
          setUser(JSON.parse(userData));
        } else {
          // Token exists but no user data, clear the token
          removeAuthToken();
        }
      } else {
        // No token found, finish loading immediately for first-time visitors
        console.log('No token found, user is not authenticated');
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid data
      removeAuthToken();
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      
      if (response.success && response.data) {
        // The response structure is: ApiResponse where data contains token and user directly
        const loginData = response.data as any;
        
        // Validate the response structure
        if (!loginData.token || !loginData.user) {
          setError('Invalid login response structure');
          return false;
        }
        
        const { token, user: userData } = loginData;
        
        // Check if user has a role assigned
        if (!userData.role || userData.role === null) {
          // Save token for profile completion flow
          setAuthToken(token);
          localStorage.setItem('profile_completion_user', JSON.stringify(userData));
          router.push('/profile-completion');
          return false; // Don't complete login yet
        }
        
        // Check user status before allowing login
        if (userData.status === 'pending') {
          // Redirect to pending approval screen without storing token
          router.push('/pending-approval');
          return false;
        }
        
        if (userData.status === 'rejected') {
          setError(getContextualErrorMessage('ACCOUNT_DISABLED', 'login'));
          return false;
        }
        
        // Only proceed if status is approved/active
        if (userData.status !== 'approved' && userData.status !== 'active') {
          setError(getContextualErrorMessage('UNAUTHORIZED', 'login'));
          return false;
        }
        
        // Validate token exists and is not empty before storing
        if (!token || typeof token !== 'string' || token.trim() === '') {
          setError(getContextualErrorMessage('INVALID_TOKEN', 'login'));
          return false;
        }
        
        // Store token in localStorage as access_token
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Log successful token storage for debugging
        console.log('Token stored successfully in localStorage as access_token');
        
        setUser(userData);
        
        return true;
      } else {
        setError(getContextualErrorMessage(response.message || 'Login failed', 'login'));
        return false;
      }
    } catch (error: any) {
      setError(getContextualErrorMessage(error, 'login', 'Login failed'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await registerUser(userData);
      
      if (response.success) {
        return true;
      } else {
        setError(getContextualErrorMessage(response.message || 'Registration failed', 'registration'));
        return false;
      }
    } catch (error: any) {
      setError(getContextualErrorMessage(error, 'registration', 'Registration failed'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  const handleForgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Don't set global isLoading for forgot password to avoid RouteGuard interference
      setError(null);
      
      const response = await forgotPassword(email);
      
      if (response.success) {
        return true;
      } else {
        setError(getContextualErrorMessage(response.message || 'Forgot password request failed', 'forgotPassword'));
        return false;
      }
    } catch (error: any) {
      setError(getContextualErrorMessage(error, 'forgotPassword', 'Forgot password request failed'));
      return false;
    }
  };

  const handleResetPassword = async (data: ResetPasswordRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await resetPassword(data);
      
      if (response.success) {
        return true;
      } else {
        setError(getContextualErrorMessage(response.message || 'Password reset failed', 'resetPassword'));
        return false;
      }
    } catch (error: any) {
      setError(getContextualErrorMessage(error, 'resetPassword', 'Password reset failed'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshAuth = () => {
    initializeAuth();
  };

  // Setup effects
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    clearError,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Use client-side navigation instead of page refresh
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}; 