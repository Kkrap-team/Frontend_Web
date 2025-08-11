import React from 'react';
import { useFollow } from '../hooks/useFollow';
import '../styles/FollowBtn.css';

const FollowBtn = ({ userId, isFollowing = false, onFollowChange }) => {
  const { following, isLoading, error, toggleFollow } = useFollow(userId, isFollowing);

  // 팔로우 상태 변경 시 부모 컴포넌트에 알림
  React.useEffect(() => {
    if (onFollowChange && following !== isFollowing) {
      onFollowChange(userId, following);
    }
  }, [following, isFollowing, userId, onFollowChange]);

  // 에러가 있으면 콘솔에 출력 (필요시 토스트나 알림으로 변경 가능)
  React.useEffect(() => {
    if (error) {
      console.error('팔로우 에러:', error);
    }
  }, [error]);

  return (
    <button
      className={`followBtn ${following ? 'following' : 'notFollowing'} ${isLoading ? 'loading' : ''}`}
      onClick={toggleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loadingText">처리중...</span>
      ) : following ? (
        '팔로잉'
      ) : (
        '팔로우'
      )}
    </button>
  );
};

export default FollowBtn;
