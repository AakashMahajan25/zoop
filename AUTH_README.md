# Authentication & Authorization System

## Overview
This document describes the authentication and authorization system implemented in the ZoopClaim frontend application.

## Global Unauthorized Handler

### What it does
The application now includes a global handler for 401 (Unauthorized) and 403 (Forbidden) HTTP responses. When any API call returns these status codes, the system automatically:

1. **Clears all session data:**
   - Removes access token from localStorage
   - Removes user data from localStorage
   - Removes profile completion data
   - Clears sessionStorage

2. **Redirects to login:**
   - Automatically redirects user to `/login` page
   - Prevents access to protected routes

3. **Prevents multiple calls:**
   - Uses a flag to prevent multiple unauthorized handlers from running simultaneously
   - Ensures clean logout process

### How it works
The handler is implemented in `src/utils/api.ts` and includes:

- **`handleUnauthorized()` function**: Core logout and redirect logic
- **`customFetch()` wrapper**: Custom fetch function that intercepts all HTTP responses
- **Global integration**: All API calls automatically use this handler

### Implementation details

```typescript
// Global unauthorized handler
let isHandlingUnauthorized = false;

const handleUnauthorized = () => {
  if (isHandlingUnauthorized) return; // Prevent multiple calls
  
  isHandlingUnauthorized = true;
  
  try {
    // Clear all authentication data
    removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('profile_completion_user');
      sessionStorage.clear();
    }
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error handling unauthorized:', error);
  } finally {
    // Reset flag after a delay to allow for cleanup
    setTimeout(() => {
      isHandlingUnauthorized = false;
    }, 1000);
  }
};
```

### Usage
The handler is automatically applied to all API calls made through:
- `apiCall()` function
- `authenticatedApiCall()` function  
- `customFetch()` function
- `validateToken()` function

### Benefits
1. **Automatic session cleanup**: No manual logout required
2. **Consistent behavior**: All unauthorized responses handled uniformly
3. **Security**: Immediate session termination on authentication failures
4. **User experience**: Seamless redirect to login page
5. **Prevents multiple calls**: Clean logout process without race conditions

## Token Management

### Storage
- **Access Token**: Stored in localStorage as `access_token`
- **User Data**: Stored in localStorage as `user`
- **Profile Data**: Stored in localStorage as `profile_completion_user`

### Token Validation
- Backend validation endpoint: `/auth/validate-token`
- Automatic validation on app initialization
- Graceful fallback if validation endpoint unavailable

## Role-Based Access Control

### User Roles
- **admin**: Full access to admin dashboard, analytics, and user management
- **auditor**: Access to audit/review functionality
- **claim-handler**: Access to claim processing and assessment
- **claim-intimation**: Access to claim registration and basic dashboard

### Route Protection
- Protected routes automatically redirect to login if unauthorized
- Role-based component rendering in dashboard
- Automatic tab selection based on user role

## API Security

### Authentication Headers
All authenticated API calls automatically include:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Error Handling
- Network errors are caught and displayed to users
- Authentication errors trigger automatic logout
- Validation errors are shown with user-friendly messages

## Session Management

### Login Flow
1. User submits credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. User data stored in localStorage
5. Redirect to appropriate dashboard based on role

### Logout Flow
1. Backend logout API called (if available)
2. All local storage cleared
3. User state reset
4. Redirect to login page

### Session Persistence
- Sessions persist across browser refreshes
- Automatic validation on app restart
- Graceful degradation if validation fails

## Security Features

### XSS Protection
- No sensitive data in URL parameters
- Secure token storage in localStorage
- Input sanitization on forms

### CSRF Protection
- JWT tokens provide CSRF protection
- Tokens included in Authorization header
- No cookies used for authentication

### Token Security
- Tokens stored securely in localStorage
- Automatic token validation
- Immediate logout on token invalidation

## Error Handling

### Network Errors
- User-friendly error messages
- Automatic retry for transient failures
- Graceful degradation for offline scenarios

### Authentication Errors
- Immediate logout and redirect
- Clear error messages for login failures
- Support for password reset and recovery

## Best Practices

### For Developers
1. Always use `authenticatedApiCall()` for protected endpoints
2. Handle API errors gracefully in components
3. Use the global error handler for consistent behavior
4. Test authentication flows thoroughly

### For Users
1. Logout when using shared devices
2. Use strong passwords
3. Report suspicious activity immediately
4. Keep browser and system updated

## Troubleshooting

### Common Issues
1. **"Unauthorized access" errors**: Usually indicate expired or invalid tokens
2. **Infinite redirects**: Check authentication state management
3. **Missing user data**: Verify localStorage and token validity

### Debug Information
- Check browser console for authentication logs
- Verify localStorage contents
- Check network tab for API responses
- Validate token format and expiration

## Future Enhancements

### Planned Features
1. Refresh token implementation
2. Multi-factor authentication
3. Session timeout warnings
4. Advanced role permissions
5. Audit logging for security events

### Security Improvements
1. Token rotation
2. Device fingerprinting
3. Suspicious activity detection
4. Enhanced encryption for sensitive data 