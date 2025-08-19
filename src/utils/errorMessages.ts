/**
 * Error message utility for mapping API error codes/messages to user-friendly messages
 */

export interface ErrorMessageMapping {
  [key: string]: string;
}

/**
 * Maps common error codes and messages to user-friendly messages
 */
const errorMessageMap: ErrorMessageMapping = {
  // Authentication errors
  'INVALID_CREDENTIALS': 'Invalid email or password. Please check your credentials and try again.',
  'USER_NOT_FOUND': 'No account found with this email address. Please check your email or sign up for a new account.',
  'INCORRECT_PASSWORD': 'Incorrect password. Please try again or use "Forgot Password" to reset it.',
  'EMAIL_NOT_VERIFIED': 'Your email address is not verified. Please check your email and click the verification link.',
  'ACCOUNT_DISABLED': 'Your account has been disabled. Please contact support for assistance.',
  'ACCOUNT_LOCKED': 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.',
  'TOKEN_EXPIRED': 'Your session has expired. Please log in again.',
  'INVALID_TOKEN': 'Invalid authentication token. Please log in again.',
  
  // Registration errors
  'EMAIL_ALREADY_EXISTS': 'An account with this email address already exists. Please use a different email or try logging in.',
  'PHONE_ALREADY_EXISTS': 'An account with this phone number already exists. Please use a different phone number.',
  'WEAK_PASSWORD': 'Password is too weak. Please ensure it contains at least 8 characters, including uppercase, lowercase, and numbers.',
  'INVALID_EMAIL_FORMAT': 'Please enter a valid email address.',
  'INVALID_PHONE_FORMAT': 'Please enter a valid phone number.',
  
  // Password reset errors
  'RESET_TOKEN_EXPIRED': 'Password reset link has expired. Please request a new one.',
  'RESET_TOKEN_INVALID': 'Invalid password reset link. Please request a new one.',
  'PASSWORD_RESET_FAILED': 'Failed to reset password. Please try again or contact support.',
  'EMAIL_NOT_FOUND': 'No account found with this email address. Please check your email or sign up for a new account.',
  
  // Profile completion errors
  'PROFILE_UPDATE_FAILED': 'Failed to update profile. Please check your information and try again.',
  'ROLE_NOT_SELECTED': 'Please select a role to continue.',
  'EXPERIENCE_INVALID': 'Please enter a valid number of years of experience.',
  'TERMS_NOT_ACCEPTED': 'You must agree to the Privacy Policy to continue.',
  
  // Network and server errors
  'NETWORK_ERROR': 'Network connection failed. Please check your internet connection and try again.',
  'SERVER_ERROR': 'Server error occurred. Please try again later.',
  'SERVICE_UNAVAILABLE': 'Service is temporarily unavailable. Please try again later.',
  'TIMEOUT_ERROR': 'Request timed out. Please check your connection and try again.',
  
  // Validation errors
  'VALIDATION_ERROR': 'Please check your input and correct any errors.',
  'REQUIRED_FIELD_MISSING': 'Please fill in all required fields.',
  'INVALID_INPUT': 'Invalid input provided. Please check your information and try again.',
  
  // Authorization errors
  'UNAUTHORIZED': 'You are not authorized to perform this action. Please log in again.',
  'FORBIDDEN': 'You do not have permission to access this resource.',
  'SESSION_EXPIRED': 'Your session has expired. Please log in again.',
  
  // Default fallback messages
  'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  'LOGIN_FAILED': 'Login failed. Please check your credentials and try again.',
  'REGISTRATION_FAILED_GENERAL': 'Registration failed. Please check your information and try again.',
  'FORGOT_PASSWORD_FAILED': 'Failed to send password reset email. Please try again.',
  'RESET_PASSWORD_FAILED': 'Failed to reset password. Please try again.',
};

/**
 * Maps HTTP status codes to user-friendly messages
 */
const statusCodeErrorMap: ErrorMessageMapping = {
  '400': 'Invalid request. Please check your information and try again.',
  '401': 'Authentication failed. Please check your credentials and try again.',
  '403': 'You do not have permission to perform this action.',
  '404': 'The requested resource was not found.',
  '409': 'User with this email or phone already exists',
  '422': 'The information provided is invalid. Please check and try again.',
  '429': 'Too many requests. Please wait a moment and try again.',
  '500': 'Server error occurred. Please try again later.',
  '502': 'Service temporarily unavailable. Please try again later.',
  '503': 'Service temporarily unavailable. Please try again later.',
  '504': 'Request timed out. Please try again.',
};

/**
 * Converts an error message or code to a user-friendly message
 * @param error - The error message, code, or Error object
 * @param fallbackMessage - Optional fallback message if no mapping is found
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (
  error: string | Error | any,
  fallbackMessage?: string
): string => {
  let errorMessage: string;
  
  // Extract message from Error object
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && error.message) {
    errorMessage = error.message;
  } else {
    return fallbackMessage || errorMessageMap['UNKNOWN_ERROR'];
  }
  
  // Clean up the error message
  errorMessage = errorMessage.trim();
  
  // Check for exact matches first
  if (errorMessageMap[errorMessage]) {
    return errorMessageMap[errorMessage];
  }
  
  // Check for partial matches (case-insensitive)
  const lowerErrorMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(errorMessageMap)) {
    if (lowerErrorMessage.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(lowerErrorMessage)) {
      return value;
    }
  }
  
  // Check for HTTP status codes in the message
  const statusCodeMatch = errorMessage.match(/HTTP error! status: (\d+)/);
  if (statusCodeMatch) {
    const statusCode = statusCodeMatch[1];
    if (statusCodeErrorMap[statusCode]) {
      return statusCodeErrorMap[statusCode];
    }
  }
  
  // Check for common error patterns
  if (lowerErrorMessage.includes('network') || lowerErrorMessage.includes('fetch')) {
    return errorMessageMap['NETWORK_ERROR'];
  }
  
  if (lowerErrorMessage.includes('timeout')) {
    return errorMessageMap['TIMEOUT_ERROR'];
  }
  
  if (lowerErrorMessage.includes('unauthorized') || lowerErrorMessage.includes('401')) {
    return errorMessageMap['UNAUTHORIZED'];
  }
  
  if (lowerErrorMessage.includes('forbidden') || lowerErrorMessage.includes('403')) {
    return errorMessageMap['FORBIDDEN'];
  }
  
  if (lowerErrorMessage.includes('email') && lowerErrorMessage.includes('exist')) {
    return errorMessageMap['EMAIL_ALREADY_EXISTS'];
  }
  
  if (lowerErrorMessage.includes('password') && (lowerErrorMessage.includes('invalid') || lowerErrorMessage.includes('incorrect'))) {
    return errorMessageMap['INCORRECT_PASSWORD'];
  }
  
  if (lowerErrorMessage.includes('user') && lowerErrorMessage.includes('not found')) {
    return errorMessageMap['USER_NOT_FOUND'];
  }
  
  // Return the fallback message or the original message if it's already user-friendly
  return fallbackMessage || 
         (errorMessage.length > 100 ? errorMessageMap['UNKNOWN_ERROR'] : errorMessage);
};

/**
 * Checks if an error message is already user-friendly
 * @param message - The error message to check
 * @returns True if the message appears to be user-friendly
 */
export const isUserFriendlyMessage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Messages that start with these patterns are likely user-friendly
  const userFriendlyPatterns = [
    'please',
    'your',
    'we',
    'unable to',
    'failed to',
    'invalid',
    'missing',
    'required',
    'too many',
    'not authorized',
    'access denied'
  ];
  
  // Technical error patterns that suggest it's not user-friendly
  const technicalPatterns = [
    'http error',
    'status:',
    'code:',
    'stack trace',
    'exception',
    'null pointer',
    'undefined',
    'syntax error'
  ];
  
  // Check for technical patterns first
  for (const pattern of technicalPatterns) {
    if (lowerMessage.includes(pattern)) {
      return false;
    }
  }
  
  // Check for user-friendly patterns
  for (const pattern of userFriendlyPatterns) {
    if (lowerMessage.startsWith(pattern)) {
      return true;
    }
  }
  
  // If the message is very short or contains error codes, it's likely technical
  if (message.length < 20 || /[A-Z_]{3,}/.test(message)) {
    return false;
  }
  
  return true;
};

/**
 * Enhanced error handler that provides context-specific messages
 */
export const getContextualErrorMessage = (
  error: string | Error | any,
  context: 'login' | 'registration' | 'forgotPassword' | 'resetPassword' | 'profile',
  fallbackMessage?: string
): string => {
  const baseMessage = getUserFriendlyErrorMessage(error, fallbackMessage);
  
  // Add context-specific guidance if the message is generic
  if (baseMessage === errorMessageMap['UNKNOWN_ERROR']) {
    switch (context) {
      case 'login':
        return 'Login failed. Please check your email and password, then try again.';
      case 'registration':
        return 'Registration failed. Please check your information and try again.';
      case 'forgotPassword':
        return 'Failed to send password reset email. Please check your email address and try again.';
      case 'resetPassword':
        return 'Failed to reset password. Please ensure your new password meets the requirements and try again.';
      case 'profile':
        return 'Failed to update profile. Please check your information and try again.';
      default:
        return baseMessage;
    }
  }
  
  return baseMessage;
};
