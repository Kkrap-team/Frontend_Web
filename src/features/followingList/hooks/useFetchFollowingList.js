import { useEffect, useState } from 'react';
import { fetchFollowingList } from '../api/fetchFollowingList';
import { useFollowStore } from '@/stores/followStore';

export const useFetchFollowingList = ({ userId } = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 전역 스토어에서 팔로우 상태 가져오기
  const { setMultipleFollowStates, getFollowState, followStates } = useFollowStore();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchFollowingList(userId);
        
        setData(response || []);
        
        // 팔로우 상태를 전역 스토어에 설정
        if (response && Array.isArray(response)) {
          const followStates = response.map(user => {
            const userId = user.followingId || user.userId;
            return {
              userId: userId,
              following: true
            };
          });
          setMultipleFollowStates(followStates);
        }
      } catch (err) {
        console.error('Error fetching following list:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, setMultipleFollowStates]);

  // 전역 스토어의 팔로우 상태 변경을 감지하여 데이터 필터링 (안전한 필터링)
  const filteredData = data.filter(user => {
    if (!user || typeof user !== 'object') return false;
    
    const userId = user.followingId || user.userId;
    if (!userId) return false;
    
    const isFollowing = getFollowState(userId);
    return isFollowing;
  });

  // 팔로우 상태가 변경될 때마다 데이터를 다시 가져오기
  useEffect(() => {
    if (userId && followStates.size > 0) {
      // 팔로우 상태가 변경되었을 때 새로운 팔로워 목록 가져오기
      const fetchUpdatedData = async () => {
        try {
          const response = await fetchFollowingList(userId);
          if (response && Array.isArray(response)) {
            setData(response);
          }
        } catch (err) {
          console.error('Error fetching updated following list:', err);
        }
      };
      
      fetchUpdatedData();
    }
  }, [followStates, userId]);

  return { data: filteredData, loading, error };
};
