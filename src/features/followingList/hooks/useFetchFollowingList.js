import { useEffect, useState } from 'react';
import { fetchFollowingList } from '../api/fetchFollowingList';

export const useFetchFollowingList = ({ userId } = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await fetchFollowingList(userId);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, loading, error };
};
