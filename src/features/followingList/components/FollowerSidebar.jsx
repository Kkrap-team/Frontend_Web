import React from "react";
import styles from '../styles/followerSidebar.module.css';

const FollowerSidebar = ({ followers }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>팔로워</div>
      <div className={styles.followerList}>
        {followers.map((f) => (
          <div key={f.followsId} className={styles.followerItem}>
            <img src={f.profile} alt={f.nickname} className={styles.avatar} />
            <span>{f.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowerSidebar;
