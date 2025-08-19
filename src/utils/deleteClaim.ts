import { apiCall, ApiResponse } from "./api";

export interface DeleteClaimResponse {
  success: number;
  message?: string;
}

export const deleteClaim = async (id: number): Promise<ApiResponse<DeleteClaimResponse>> => {
  const storedToken =
    localStorage.getItem("refreshToken") ||
    localStorage.getItem("refresh_token") ||
    "";

  if (!id) throw new Error("ID is required to delete a claim");

  return apiCall<DeleteClaimResponse>(`/v1/intimation/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedToken}`,
    },
  });
};
