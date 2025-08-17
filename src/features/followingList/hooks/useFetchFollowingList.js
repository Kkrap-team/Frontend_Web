import { useEffect, useState } from 'react';
import { fetchFollowingList } from '../api/fetchFollowingList';
import { useFollowStore } from '@/stores/followStore';

export const useFetchFollowingList = ({ userId } = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 전역 스토어에서 팔로우 상태 가져오기
  const { setMultipleFollowStates, getFollowState } = useFollowStore();

  console.log('useFetchFollowingList called with userId:', userId);

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided, skipping fetch');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching following list for userId:', userId);
        const response = await fetchFollowingList(userId);
        console.log('=== fetchFollowingList response ===');
        console.log('Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        console.log('First user example:', response?.[0]);
        
        setData(response || []);
        
        // 팔로우 상태를 전역 스토어에 설정
        if (response && Array.isArray(response)) {
          const followStates = response.map(user => {
            const userId = user.followingId || user.userId;
            console.log(`User mapping:`, {
              original: user,
              mappedUserId: userId,
              hasFollowingId: !!user.followingId,
              hasUserId: !!user.userId
            });
            return {
              userId: userId,
              following: true
            };
          });
          console.log('Setting follow states to store:', followStates);
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

  // 전역 스토어의 팔로우 상태 변경을 감지하여 데이터 필터링
  const filteredData = data.filter(user => {
    const userId = user.followingId || user.userId;
    const isFollowing = getFollowState(userId);
    console.log(`Filtering user ${userId}:`, {
      user: user,
      isFollowing: isFollowing,
      storeState: getFollowState(userId)
    });
    return isFollowing;
  });

  console.log('=== useFetchFollowingList Debug ===');
  console.log('Original data count:', data.length);
  console.log('Filtered data count:', filteredData.length);
  console.log('Store states:', useFollowStore.getState().followStates);

  return { data: filteredData, loading, error };
};
