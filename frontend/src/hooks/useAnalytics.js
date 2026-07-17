import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsService } from '../services/analyticsService';

const initialState = {
  overview: null, monthly: null, status: null, followups: null,
  services: null, sources: null, priorities: null,
  topCompanies: null, teamPerformance: null, recentActivity: null,
  filters: null
};

export function useAnalytics(filterParams = {}) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsRef = useRef(filterParams);
  paramsRef.current = filterParams;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = paramsRef.current;
    try {
      const res = await Promise.all([
        analyticsService.getOverview(params),
        analyticsService.getMonthly(params),
        analyticsService.getStatus(params),
        analyticsService.getFollowups(params),
        analyticsService.getServices(params),
        analyticsService.getSources(params),
        analyticsService.getPriorities(params),
        analyticsService.getTopCompanies(params),
        analyticsService.getTeamPerformance(params),
        analyticsService.getRecentActivity(params),
        analyticsService.getFilters()
      ]);

      setData({
        overview: res[0].data,
        monthly: res[1].data,
        status: res[2].data,
        followups: res[3].data,
        services: res[4].data,
        sources: res[5].data,
        priorities: res[6].data,
        topCompanies: res[7].data,
        teamPerformance: res[8].data,
        recentActivity: res[9].data,
        filters: res[10].data,
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, JSON.stringify(filterParams)]);

  const refresh = useCallback(() => fetchAll(), [fetchAll]);

  return { data, loading, error, refresh };
}
