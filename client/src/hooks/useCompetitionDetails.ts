import { useState, useEffect, useCallback } from 'react';
import { getCompetitionDetails, registerForCompetition, submitCompetition } from '../services/competitionService';
import { ICompetitionDetailsResponse } from '../types/competition';

export const useCompetitionDetails = (competitionId: string, userId: string) => {
  const [data, setData] = useState<ICompetitionDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCompetitionDetails(competitionId, userId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load competition details');
    } finally {
      setLoading(false);
    }
  }, [competitionId, userId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const register = async (): Promise<boolean> => {
    try {
      setRegistering(true);
      setError(null);
      await registerForCompetition(competitionId, userId);
      // RE-FETCH DATABASE STATE directly after registration
      await fetchDetails();
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setRegistering(false);
    }
  };

  const submitEntry = async (mediaUrl: string, caption?: string): Promise<boolean> => {
    try {
      setSubmitting(true);
      setError(null);
      await submitCompetition(competitionId, userId, mediaUrl, caption);
      await fetchDetails();
      return true;
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    data,
    loading,
    registering,
    submitting,
    error,
    refetch: fetchDetails,
    register,
    submitEntry,
  };
};
