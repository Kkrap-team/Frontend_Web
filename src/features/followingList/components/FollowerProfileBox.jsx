import styles from '../styles/followerProfileBox.module.css';
import React from "react";
import { useNavigate } from '@tanstack/react-router';

const FollowerProfileBox = ({ follower }) => {
  const navigate = useNavigate();

  // 데이터 유효성 검증
  if (!follower || typeof follower !== 'object') {
    return null; // 잘못된 데이터면 렌더링하지 않음
  }

  // 필수 속성 검증
  const { nickname, profile, email, followingId, userId } = follower;
  
  if (!nickname) {
    return null;
  }

  const handleProfileClick = () => {
    try {
      // followingId 또는 userId 중 존재하는 것을 사용
      const targetUserId = followingId || userId;
      if (targetUserId) {
        navigate({ to: `/storage/${targetUserId}` });
      } else {
        console.error('No userId found in follower data:', follower);
        alert('사용자 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert('페이지 이동 중 오류가 발생했습니다.');
    }
  };

  // 프로필 이미지 URL 안전하게 처리
  const profileImageUrl = profile && typeof profile === 'string' && profile.trim() !== '' 
    ? profile 
    : '/default-profile.png';

  return (
    <div className={styles.profileBox}>
      <div
        className={styles.profileImage}
        onClick={handleProfileClick}
        style={{
          backgroundImage: `url(${profileImageUrl})`,
          cursor: 'pointer'
        }}
      />
      <div className={styles.profileInfo}>
        <div className={styles.nickname}>{nickname}</div>
        {email && typeof email === 'string' && email.trim() !== '' && (
          <div className={styles.email}>{email}</div>
        )}
      </div>
    </div>
  );
};

export default FollowerProfileBox;
