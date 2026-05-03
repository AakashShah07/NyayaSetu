import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, params = null, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(params);
      setData(res.data);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFn, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled) fetch();
  }, [fetch, enabled]);

  return { data, pagination, loading, error, refetch: fetch };
}
