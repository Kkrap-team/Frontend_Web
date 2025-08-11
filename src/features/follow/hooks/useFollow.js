import { useState, useCallback } from 'react';
import { followUser, unfollowUser } from '../api/followApi';

/**
 * 팔로우/언팔로우 상태와 로직을 관리하는 hook
 * @param {number} userId - 사용자 ID
 * @param {boolean} initialFollowing - 초기 팔로우 상태
 * @returns {Object} 팔로우 상태와 함수들
 */
export const useFollow = (userId, initialFollowing = false) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleFollow = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (following) {
        // 언팔로우
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        // 팔로우
        await followUser(userId);
        setFollowing(true);
      }
    } catch (err) {
      console.error('팔로우/언팔로우 처리 실패:', err);
      setError(err.message || '처리 중 오류가 발생했습니다.');
      // 에러 발생 시 상태 복원
      setFollowing(initialFollowing);
    } finally {
      setIsLoading(false);
    }
  }, [userId, following, isLoading, initialFollowing]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    following,
    isLoading,
    error,
    toggleFollow,
    resetError,
    setFollowing // 외부에서 상태 강제 변경 시 사용
  };
};
