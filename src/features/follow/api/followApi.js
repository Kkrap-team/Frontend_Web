import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

/**
 * 사용자를 팔로우하는 API
 * @param {number} followingId - 팔로우할 사용자의 ID
 * @returns {Promise} API 응답
 */
export const followUser = async (followingId) => {
  try {
    const response = await api.post(`${url}/follows/follow`, {
      followingId: followingId
    });
    return response.data;
  } catch (error) {
    console.error('팔로우 요청 실패:', error);
    throw error;
  }
};

/**
 * 사용자를 언팔로우하는 API
 * @param {number} followingId - 언팔로우할 사용자의 ID
 * @returns {Promise} API 응답
 */
export const unfollowUser = async (followingId) => {
  try {
    const response = await api.delete(`${url}/follows/unfollow`, {
      data: {
        followingId: followingId
      }
    });
    return response.data;
  } catch (error) {
    console.error('언팔로우 요청 실패:', error);
    throw error;
  }
};

// 팔로우 상태 확인 (mutual)
export const checkFollowStatus = async (targetUserId) => {
    try {
        const response = await api.get(`/follows/mutual?targetUserId=${targetUserId}`);
        return response.data;
    } catch (error) {
        console.error('팔로우 상태 확인 실패:', error);
        throw error;
    }
};
