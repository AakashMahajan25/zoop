import { apiCall, ApiResponse } from "./api";
import { Step1Data, Step2Data, Step3Data } from '@/types/intimationInterface';
 
export interface GetClaimsResponse {
  success: number;
  data: [];
  message?: string;
}

export const getClaimsById = async (id:any): Promise<ApiResponse<GetClaimsResponse>> => {
  const storedToken =
    localStorage.getItem("refreshToken") ||
    localStorage.getItem("refresh_token") ||
    "";

  console.log("storedToken", storedToken);

  return apiCall<GetClaimsResponse>(`/intimation/claim/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedToken}`,
    },
  });
};
