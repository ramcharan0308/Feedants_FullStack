import { request } from './apiClient';
import {
  ICompetitionDetailsResponse,
  IWinnerItem,
  IRegistrationResult,
  ISubmissionResult,
} from '../types/competition';

export const getCompetitionDetails = async (
  competitionId: string,
  userId?: string
): Promise<ICompetitionDetailsResponse> => {
  return request<ICompetitionDetailsResponse>(`/competitions/${competitionId}`, {
    method: 'GET',
    userId,
  });
};

export const getCompetitionWinners = async (competitionId: string): Promise<IWinnerItem[]> => {
  const res = await request<{ winners: IWinnerItem[] }>(`/competitions/${competitionId}/winners`, {
    method: 'GET',
  });
  return res.winners;
};

export const registerForCompetition = async (
  competitionId: string,
  userId: string,
  paymentToken = 'pay_mock_success'
): Promise<IRegistrationResult> => {
  return request<IRegistrationResult>(`/competitions/${competitionId}/register`, {
    method: 'POST',
    userId,
    body: { paymentToken },
  });
};

export const submitCompetition = async (
  competitionId: string,
  userId: string,
  mediaUrl: string,
  caption?: string
): Promise<ISubmissionResult> => {
  return request<ISubmissionResult>(`/competitions/${competitionId}/submit`, {
    method: 'POST',
    userId,
    body: { mediaUrl, caption },
  });
};
