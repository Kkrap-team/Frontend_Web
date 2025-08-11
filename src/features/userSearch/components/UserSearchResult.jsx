import React from 'react';
import styles from '../styles/userSearchModal.module.css';
import FollowBtn from '../../follow/components/FollowBtn';

const UserSearchResult = ({ user, onFollowChange }) => {
  return (
    <div className={styles.row}>
      <div className={styles.userInfo}>
        <div className={styles.profileImage}>
          <img 
            src={user.profile || '/public/account_circle.png'} 
            alt={user.nickname}
            onError={(e) => {
              e.target.src = '/public/account_circle.png';
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
        isFollowing={user.isFollowing || false}
        onFollowChange={onFollowChange}
      />
    </div>
  );
};

export default UserSearchResult; 