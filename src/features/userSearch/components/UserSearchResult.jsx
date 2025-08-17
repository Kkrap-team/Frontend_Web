import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from '../styles/userSearchModal.module.css';
import FollowBtn from '../../follow/components/FollowBtn';

const UserSearchResult = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user.userId) {
      // 모달을 먼저 닫고 페이지 이동
      if (onClose) {
        onClose();
      }
      navigate({ to: `/storage/${user.userId}` });
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.userInfo}>
        <div className={styles.profileImage}>
          <img 
            src={user.profile || '/account_circle.png'} 
            alt={user.nickname}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
            onError={(e) => {
              e.target.src = '/account_circle.png';
            }}
          />
        </div>
        <div className={styles.userDetails}>
          <div className={styles.nickname}>{user.nickname}</div>
          <div className={styles.email}>{user.email || '이메일 없음'}</div>
        </div>
      </div>
      <FollowBtn 
        userId={user.userId} 
        isFollowing={user.following}
      />
    </div>
  );
};

export default UserSearchResult; 