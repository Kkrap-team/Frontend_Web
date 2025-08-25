import React from 'react';
import { useFollow } from '../hooks/useFollow';
import { useModal } from '@/contexts/ModalContext';
import '../styles/FollowBtn.css';

const FollowBtn = ({ userId, isFollowing = false }) => {
  const { following, isLoading, error, toggleFollow, performUnfollow } = useFollow(userId, isFollowing);
  const { showConfirm } = useModal();

  // 언팔로우 확인 모달 표시
  const handleUnfollowClick = () => {
    showConfirm({
      title: '언팔로우',
      message: '해당 사용자를 언팔로우 하시겠습니까?',
      confirmText: '언팔로우',
      cancelText: '취소',
      confirmType: 'delete',
      onConfirm: performUnfollow
    });
  };

  // 에러가 있으면 콘솔에 출력 (필요시 토스트나 알림으로 변경 가능)
  React.useEffect(() => {
    if (error) {
      console.error('팔로우 에러:', error);
    }
  }, [error]);

  return (
    <button
      className={`followBtn ${following ? 'following' : 'notFollowing'} ${isLoading ? 'loading' : ''}`}
      onClick={following ? handleUnfollowClick : toggleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loadingText">처리중...</span>
      ) : following ? (
        '언팔로우'
      ) : (
        '팔로우'
      )}
    </button>
  );
};

export default FollowBtn;
