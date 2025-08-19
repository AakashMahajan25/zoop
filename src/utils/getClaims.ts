import { apiCall, ApiResponse, authenticatedApiCall } from "./api";
import { Step1Data, Step2Data, Step3Data } from '@/types/intimationInterface';
 
export interface GetClaimsResponse {
  success: number;
  data: any[];
  message?: string;
}

export interface GetClaimsParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const getClaims = async (params?: GetClaimsParams): Promise<ApiResponse<GetClaimsResponse>> => {
  const storedToken =
    localStorage.getItem("access_token") ||
    "";

  console.log("storedToken", storedToken);

  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/intimation/claims?${queryString}` : "/intimation/claims";

  return authenticatedApiCall<GetClaimsResponse>(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedToken}`,
    },
  });
};

// Helper functions for different tabs
export const getInitiatedClaims = async (params?: Omit<GetClaimsParams, 'status'>) => {
  return getClaims({ ...params, status: 'submitted' });
};

export const getAssignedClaims = async (params?: Omit<GetClaimsParams, 'status'>) => {
  return getClaims({ ...params, status: 'assigned' });
};

export const getDraftClaims = async (params?: Omit<GetClaimsParams, 'status'>) => {
  return getClaims({ ...params, status: 'draft' });
};