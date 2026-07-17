import { useState, useEffect, useCallback } from 'react';
import { leadService } from '../services/leadService';
import toast from 'react-hot-toast';

export function useLeads(initialParams = {}) {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(initialParams);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadService.getAll(params);
      setLeads(res.data.leads);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const deleteLead = async (id) => {
    try {
      await leadService.delete(id);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return { leads, pagination, loading, params, setParams, fetchLeads, deleteLead };
}
