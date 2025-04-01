import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('pro_id', supabase.auth.user()?.id);
      setLeads(data || []);
      setLoading(false);
    };

    fetchLeads();
  }, []);

  return { leads, loading };
}