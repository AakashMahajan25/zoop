import { apiCall, authenticatedApiCall, ApiResponse } from "./api";
import { PolicyDetails, InsurerInformation, WorkshopDetails, Allocation } from '@/types/intimationInterface';
 
export interface SubmitIntimationResponse {
  intimation_id: number;
  reference_id?: string;
  status: string;
  message?: string;
}

export interface SubmitIntimationRequest {
  reference_id?: string;
  policyDetails: PolicyDetails;
  insurerInformation: InsurerInformation;
  workshopDetails: WorkshopDetails;
  allocation: Allocation;
}

export const submitIntimation = async (
  payload: SubmitIntimationRequest
): Promise<ApiResponse<SubmitIntimationResponse>> => {
  return authenticatedApiCall<SubmitIntimationResponse>('/intimation/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export interface SaveDraftResponse {
  draft_id?: number;
  reference_id?: string;
  status: string;
  message?: string;
}

export interface SaveDraftRequest {
  reference_id?: string;
  policyDetails?: Partial<PolicyDetails>;
  insurerInformation?: Partial<InsurerInformation>;
  workshopDetails?: Partial<WorkshopDetails>;
  allocation?: Partial<Allocation>;
}

export const saveDraft = async (
  payload: SaveDraftRequest
): Promise<ApiResponse<SaveDraftResponse>> => {
  return authenticatedApiCall<SaveDraftResponse>('/intimation/draft', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};