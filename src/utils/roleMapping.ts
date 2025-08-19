/**
 * Role mapping utilities for converting between numeric role_id and string role names
 * Based on the role mapping:
 * 1 = claim-handler
 * 2 = claim-intimation  
 * 3 = auditor
 * 4 = admin
 */

interface JWTPayload {
  id: number;
  email: string;
  role_id: number;
  iat: number;
  exp: number;
}

export type Role = 'admin' | 'claim-intimation' | 'auditor' | 'claim-handler';

export const roleMapping = {
  1: 'claim-handler',
  2: 'claim-intimation', 
  3: 'auditor',
  4: 'admin'
} as const;

/**
 * Converts a numeric role_id to a string role name
 * @param roleId - The numeric role ID from the API
 * @returns The corresponding role name or 'claim-intimation' as default
 */
export const getRoleFromId = (roleId: number): Role => {
  return (roleMapping[roleId as keyof typeof roleMapping] || 'claim-intimation') as Role;
};

/**
 * Converts a string role name to a numeric role_id
 * @param roleName - The string role name
 * @returns The corresponding numeric role ID or 2 as default (claim-intimation)
 */
export const getRoleIdFromName = (roleName: string): number => {
  const entry = Object.entries(roleMapping).find(([_, name]) => name === roleName);
  return entry ? parseInt(entry[0]) : 2;
};

/**
 * Gets role display name for UI purposes
 * @param role - The role string
 * @returns Formatted display name
 */
export const getRoleDisplayName = (role: Role): string => {
  const displayNames: Record<Role, string> = {
    'admin': 'Administrator',
    'claim-intimation': 'Claim Intimation',
    'auditor': 'Auditor',
    'claim-handler': 'Claim Handler'
  };
  
  return displayNames[role] || 'User';
};

/**
 * Decodes a JWT token without verification (client-side only)
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64url decoding
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    
    // Replace URL-safe characters
    const base64 = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
    
    const decoded = JSON.parse(atob(base64));
    return decoded as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Gets the current user's role from localStorage JWT token
 * @returns The user's role string or 'claim-intimation' as default
 */
export const getCurrentUserRole = (): Role => {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return 'claim-intimation';
  }
  
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 'claim-intimation';
    }
    
    const payload = decodeJWT(accessToken);
    if (!payload || !payload.role_id) {
      return 'claim-intimation';
    }
    
    return getRoleFromId(payload.role_id);
  } catch (error) {
    console.error('Failed to get current user role:', error);
    return 'claim-intimation';
  }
};
