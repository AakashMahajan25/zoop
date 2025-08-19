// API Configuration
export const API_BASE_URL: string = (() => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080/api/v1';
  }

  return 'http://13.235.82.24:8080/api/v1';
})();

// Global unauthorized handler
let isHandlingUnauthorized = false;

const handleUnauthorized = () => {
  if (isHandlingUnauthorized) return; // Prevent multiple calls
  
  isHandlingUnauthorized = true;
  
  try {
    // Don't redirect if we're already on login/auth pages
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/sign-up', '/forgot-password', '/reset-password'];
      
      // Clear all authentication data
      removeAuthToken();
      localStorage.removeItem('user');
      localStorage.removeItem('profile_completion_user');
      // Clear any other session-related data
      sessionStorage.clear();
      
      // Only redirect if not already on an auth page
      if (!authPaths.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
  } catch (error) {
    // Error handling unauthorized
  } finally {
    // Reset flag after a delay to allow for cleanup
    setTimeout(() => {
      isHandlingUnauthorized = false;
    }, 1000);
  }
};

// Custom fetch wrapper for global 401/403 handling
export const customFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    // Don't trigger global unauthorized handling for auth endpoints
    const isAuthEndpoint = url.includes('/auth/login') || 
                          url.includes('/auth/register') || 
                          url.includes('/auth/forgot-password') || 
                          url.includes('/auth/reset-password');
    
    // Check for unauthorized status and handle globally (except for auth endpoints)
    if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
      handleUnauthorized();
      throw new Error('Unauthorized access. Please login again.');
    }
    
    return response;
  } catch (error: any) {
    // If it's already our unauthorized error, re-throw it
    if (error.message === 'Unauthorized access. Please login again.') {
      throw error;
    }
    
    // For other errors, check if it's a network error that might be 401/403
    // But don't trigger for auth endpoints
    if (error.message && error.message.includes('HTTP error! status: 401')) {
      const isAuthEndpoint = url.includes('/auth/login') || 
                            url.includes('/auth/register') || 
                            url.includes('/auth/forgot-password') || 
                            url.includes('/auth/reset-password');
      
      if (!isAuthEndpoint) {
        handleUnauthorized();
        throw new Error('Unauthorized access. Please login again.');
      }
    }
    
    throw error;
  }
};

export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'accept': '*/*',
});

export interface ApiResponse<T = any> {
  ok: any;
  status: any;
  json(): unknown;
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await customFetch(url, {
    headers: getDefaultHeaders(),
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      message: 'Network error occurred'
    }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};


// Register Request and Response Types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role_id?: number;
}

export interface RegisteredUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  is_email_verified: boolean;
  email_verification_token_expires: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: RegisteredUser;
  };
}

export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  return apiCall<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};



// Login Request and Response Types
export interface LoginRequest {
  email: string;
  password: string;
  role_id?: number;
}

export interface LoginResponseSuccess {
  success: true;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      role_id: number;
      is_email_verified: boolean;
      email_verification_token_expires: string | null;
      password_reset_token: string | null;
      password_reset_expires: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
      role: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
      } | null;
    };
  };
}

export interface AdminUser {
  id: number,
  email: string,
  username: string,
  role: string,
  department: string,
  responsibility: string,
  zone: string,
  experience: number,
  profileCompleted: boolean,
  userStatus: 'Approved' | 'Pending' | 'Remove' | 'Rejected',
  rejectionReason: string | null,
  dueDate: string,
  lastUpdated: string,
  caseCount: number
}
export type AdminUserListResponse = ApiResponse<AdminUser[]>;
export interface LoginResponseError {
  success: false;
  error: {
    message: string;
  };
}

export type LoginResponse = LoginResponseSuccess | LoginResponseError;

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return apiCall<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};





export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  return apiCall('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse> => {
  return apiCall('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutUser = async (): Promise<ApiResponse> => {
  return authenticatedApiCall('/auth/logout', {
    method: 'POST',
  });
};

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const authenticatedApiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    return await apiCall<T>(endpoint, {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch (error: any) {
    // If the error is already handled by apiCall (401/403), re-throw it
    if (error.message === 'Unauthorized access. Please login again.') {
      throw error;
    }
    
    // For other errors, check if it's a network error that might be 401/403
    if (error.message && error.message.includes('HTTP error! status: 401')) {
      handleUnauthorized();
      throw new Error('Unauthorized access. Please login again.');
    }
    
    throw error;
  }
};

// TODO: Implement this endpoint on the backend when session management is ready
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await customFetch(`${API_BASE_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        ...getDefaultHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.success === true;
    }

    return false;
  } catch (error: any) {
    // If it's our unauthorized error, return false
    if (error.message === 'Unauthorized access. Please login again.') {
      return false;
    }
    
    // For now, assume token is valid if it exists
    return !!token;
  }
};

// Email Verification Types
export interface EmailVerificationRequest {
  token: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export const verifyEmail = async (token: string): Promise<ApiResponse<EmailVerificationResponse>> => {
  return apiCall<EmailVerificationResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'GET',
  });
};

// Roles Types
export interface Roles {
  id: number;
  name: string;
}

export const getRoles = async (): Promise<Roles[]> => {
  const res = await apiCall<Roles[]>('/roles', { method: 'GET' });
  return res?.data ?? [];
};

// Profile Types and Functions
export interface CompleteProfilePayload {
  department: string;
  responsibility: string;
  experience_years: number;
}

export interface ProfileResponse {
  id: number;
  user_id: number;
  department: string;
  responsibility: string;
  zone: string;
  experience_years: number;
  status: 'pending' | 'active' | 'rejected';
  is_active: boolean;
}

export const completeProfile = async (
  payload: CompleteProfilePayload
): Promise<ProfileResponse> => {
  const res = await authenticatedApiCall<ProfileResponse>('/profile/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res?.data) {
    throw new Error('Failed to complete profile');
  }

  return res.data;
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const res = await authenticatedApiCall<AdminUser[]>('/admin/list');
  if (!res?.data) throw new Error('Failed to fetch users');
  return res.data;
};

// Approve user
export const approveAdminUser = async (
  userId: number
): Promise<ApiResponse> => {
  const res = await authenticatedApiCall<ApiResponse>(
    `/admin/approve/${userId}`,
    { method: 'PATCH' }
  );
  console.log("approve Response", res.data)
  if (!res?.data) {
    throw new Error('Failed to approve user');
  }

  return res.data;
};

// Reject user (needs reason)
export const rejectAdminUser = async (
  userId: number,
  reason: string
): Promise<ApiResponse> => {
  const res = await authenticatedApiCall<ApiResponse>(
    `/admin/reject/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }
  );
  console.log("reject Response", res.data)
  if (!res?.data) {
    throw new Error('Failed to reject user');
  }

  return res.data;
};

// Remove user (only if rejected)
export const removeAdminUser = async (
  userId: number
): Promise<{ success: boolean; message?: string }> => {
  const res = await authenticatedApiCall<{ success: boolean; message?: string }>(
    `/admin/remove/${userId}`,
    { method: 'DELETE' }
  );

  // Some DELETE APIs return no body (204). Normalize the response.
  if (!res || res.status === 204) {
    return { success: true, message: "User removed successfully" };
  }

  // If backend *does* return a body, use it
  return res.data || { success: true, message: "User removed successfully" };
};

// Claim Handlers Types and Functions
export interface ClaimHandler {
  id: number;
  name: string;
}

export interface ClaimHandlersResponse {
  success: boolean;
  data: ClaimHandler[];
}

export const getClaimHandlers = async (): Promise<ClaimHandler[]> => {
  const res = await authenticatedApiCall<ClaimHandlersResponse>('/profile/claim-handlers', {
    method: 'GET',
  });
  
  // Check if res.data is directly an array of handlers
  if (Array.isArray(res.data)) {
    return res.data as ClaimHandler[];
  }
  
  // Check if res.data has the expected structure {success: true, data: [...]}
  const claimHandlersResponse = res.data as ClaimHandlersResponse;
  if (claimHandlersResponse?.success && Array.isArray(claimHandlersResponse.data)) {
    return claimHandlersResponse.data;
  }
  
  throw new Error('Failed to fetch claim handlers');
};