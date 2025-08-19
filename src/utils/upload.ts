import { apiCall, authenticatedApiCall, ApiResponse, getAuthToken } from "./api";

// Upload Request and Response Types
export interface UploadDocumentRequest {
  file: File;
  document_type_id: number;
  metadata?: Record<string, any>;
}

export interface UploadDocumentResponse {
  document_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  document_type_id: number;
  uploaded_at: string;
  status: string;
  message?: string;
}

export interface UploadMultipleDocumentsRequest {
  documents: UploadDocumentRequest[];
}

export interface UploadMultipleDocumentsResponse {
  documents: UploadDocumentResponse[];
  total_uploaded: number;
  total_failed: number;
  message?: string;
}

// Upload single document
export const uploadDocument = async (
  documentData: UploadDocumentRequest,
  customUserId?: string | number
): Promise<ApiResponse<UploadDocumentResponse>> => {
  const userId = customUserId || getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not available. Please ensure user is authenticated.');
  }
  
  const formData = new FormData();
  formData.append('files', documentData.file);
  formData.append('meta', JSON.stringify([{ document_type_id: documentData.document_type_id }]));
  
  if (documentData.metadata) {
    // Add additional metadata if needed
    formData.append('metadata', JSON.stringify(documentData.metadata));
  }

  // Get token manually to avoid Content-Type conflicts with FormData
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiCall<UploadDocumentResponse>(`/uploads/users/${userId}/documents`, {
    method: 'POST',
    body: formData,
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Upload multiple documents
export const uploadMultipleDocuments = async (
  documents: UploadDocumentRequest[],
  customUserId?: string | number
): Promise<ApiResponse<UploadMultipleDocumentsResponse>> => {
  const userId = customUserId || getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not available. Please ensure user is authenticated.');
  }
  
  const formData = new FormData();
  
  documents.forEach((doc, index) => {
    formData.append(`files`, doc.file);
    formData.append(`meta`, JSON.stringify([{ document_type_id: doc.document_type_id }]));
    
    if (doc.metadata) {
      formData.append(`metadata`, JSON.stringify(doc.metadata));
    }
  });

  // Get token manually to avoid Content-Type conflicts with FormData
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiCall<UploadMultipleDocumentsResponse>(`/uploads/users/${userId}/documents/batch`, {
    method: 'POST',
    body: formData,
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Get user documents
export interface GetUserDocumentsResponse {
  documents: UploadDocumentResponse[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export const getUserDocuments = async (
  page: number = 1,
  limit: number = 10,
  documentTypeId?: number,
  customUserId?: string | number
): Promise<ApiResponse<GetUserDocumentsResponse>> => {
  const userId = customUserId || getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not available. Please ensure user is authenticated.');
  }
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (documentTypeId) {
    params.append('document_type_id', documentTypeId.toString());
  }

  return authenticatedApiCall<GetUserDocumentsResponse>(`/uploads/users/${userId}/documents?${params.toString()}`, {
    method: 'GET',
  });
};

// Delete document
export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

export const deleteDocument = async (
  documentId: string,
  customUserId?: string | number
): Promise<ApiResponse<DeleteDocumentResponse>> => {
  const userId = customUserId || getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not available. Please ensure user is authenticated.');
  }
  
  // Get token manually to avoid Content-Type conflicts
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiCall<DeleteDocumentResponse>(`/uploads/users/${userId}/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Update document metadata
export interface UpdateDocumentMetadataRequest {
  metadata: Record<string, any>;
}

export interface UpdateDocumentMetadataResponse {
  document_id: string;
  metadata: Record<string, any>;
  updated_at: string;
  message?: string;
}

export const updateDocumentMetadata = async (
  documentId: string,
  metadata: Record<string, any>,
  customUserId?: string | number
): Promise<ApiResponse<UpdateDocumentMetadataResponse>> => {
  const userId = customUserId || getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not available. Please ensure user is authenticated.');
  }
  
  // Get token manually to avoid Content-Type conflicts
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiCall<UpdateDocumentMetadataResponse>(`/uploads/users/${userId}/documents/${documentId}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({ metadata }),
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Get available document types from backend
export interface DocumentType {
  id: number;
  name: string;
  description?: string;
}

export interface GetDocumentTypesResponse {
  document_types: DocumentType[];
  message?: string;
}

export const getDocumentTypes = async (): Promise<ApiResponse<GetDocumentTypesResponse>> => {
  return apiCall<GetDocumentTypesResponse>('/uploads/document-types', {
    method: 'GET',
  });
};

// Document type constants - using 1 for everything as requested
export const DOCUMENT_TYPE_IDS = {
  POLICY_COPY: 1,
  INTIMATION_FORM: 1,
  CLAIMS_FORM: 1,
  VEHICLE_RC: 1,
  DRIVING_LICENSE: 1,
  INSURANCE_COPY: 1,
  WORKSHOP_ESTIMATE: 1,
  REPAIR_PHOTOS: 1,
  INSPECTION_REPORT: 1,
  ALLOCATION_FORM: 1,
  SURVEYOR_REPORT: 1,
  AADHAR_CARD: 1,
  PAN_CARD: 1,
  OTHER: 1,
} as const;

// Alternative document type IDs - try these if the above don't work
export const ALTERNATIVE_DOCUMENT_TYPE_IDS = {
  POLICY_COPY: 1,
  INTIMATION_FORM: 1,
  CLAIMS_FORM: 1,
  VEHICLE_RC: 1,
  DRIVING_LICENSE: 1,
  INSURANCE_COPY: 1,
  WORKSHOP_ESTIMATE: 1,
  REPAIR_PHOTOS: 1,
  INSPECTION_REPORT: 1,
  ALLOCATION_FORM: 1,
  SURVEYOR_REPORT: 1,
  AADHAR_CARD: 1,
  PAN_CARD: 1,
  OTHER: 1,
} as const;

export type DocumentTypeId = typeof DOCUMENT_TYPE_IDS[keyof typeof DOCUMENT_TYPE_IDS];

// Helper function to get current user ID from JWT token
export const getCurrentUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found');
        return null;
      }
      
      // Decode JWT token to extract user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || payload.id || null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }
  return null;
};
