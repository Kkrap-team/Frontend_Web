import styles from '../styles/followerProfileBox.module.css';
import React from "react";
import { useNavigate } from '@tanstack/react-router';

const FollowerProfileBox = ({ follower }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log('FollowerProfileBox clicked:', follower);
    // followingId 또는 userId 중 존재하는 것을 사용
    const targetUserId = follower.followingId || follower.userId;
    if (targetUserId) {
      console.log('Navigating to:', `/storage/${targetUserId}`);
      navigate({ to: `/storage/${targetUserId}` });
    } else {
      console.error('No userId found in follower data:', follower);
    }
  };

  return (
    <div className={styles.profileBox}>
      <div
        className={styles.profileImage}
        onClick={handleProfileClick}
        style={{
          backgroundImage: `url(${follower.profile || '/default-profile.png'})`,
          cursor: 'pointer'
        }}
      />
      <div className={styles.profileInfo}>
        <div className={styles.nickname}>{follower.nickname}</div>
        {follower.email && (
          <div className={styles.email}>{follower.email}</div>
        )}
      </div>
    </div>
  );
};

export default FollowerProfileBox;
