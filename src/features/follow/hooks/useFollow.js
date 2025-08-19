import { useState, useCallback, useEffect } from 'react';
import { followUser, unfollowUser } from '../api/followApi';
import { useFollowStore } from '@/stores/followStore';

/**
 * 팔로우/언팔로우 상태와 로직을 관리하는 hook
 * @param {number} userId - 사용자 ID
 * @param {boolean} initialFollowing - 초기 팔로우 상태
 * @returns {Object} 팔로우 상태와 함수들
 */
export const useFollow = (userId, initialFollowing = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 전역 스토어에서 팔로우 상태 가져오기
  const { 
    getFollowState, 
    setFollowState, 
    toggleFollowState 
  } = useFollowStore();
  
  const following = getFollowState(userId);
  

  
  // 초기 상태 설정
  useEffect(() => {
    if (initialFollowing !== undefined && !getFollowState(userId)) {
      console.log(`Setting initial state for user ${userId}:`, initialFollowing);
      setFollowState(userId, initialFollowing);
    }
  }, [userId, initialFollowing, getFollowState, setFollowState]);

  // 팔로우 처리
  const toggleFollow = useCallback(async () => {
    if (isLoading) return;
    
    console.log(`Following user ${userId}`);
    setIsLoading(true);
    setError(null);
    
    try {
      await followUser(userId);
      console.log(`Successfully followed user ${userId}, updating store`);
      setFollowState(userId, true);
    } catch (err) {
      console.error('팔로우 처리 실패:', err);
      setError(err.message || '팔로우 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading, setFollowState]);

  // 언팔로우 처리
  const performUnfollow = useCallback(async () => {
    if (isLoading) return;
    
    console.log(`Unfollowing user ${userId}`);
    setIsLoading(true);
    setError(null);
    
    try {
      await unfollowUser(userId);
      console.log(`Successfully unfollowed user ${userId}, updating store`);
      setFollowState(userId, false);
    } catch (err) {
      console.error('언팔로우 처리 실패:', err);
      setError(err.message || '언팔로우 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading, setFollowState]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    following,
    isLoading,
    error,
    toggleFollow,
    performUnfollow,
    resetError,
    setFollowing: (isFollowing) => setFollowState(userId, isFollowing) // 외부에서 상태 강제 변경 시 사용
  };
};
