import React from "react";
import styles from '../styles/followerSidebar.module.css';

const FollowerSidebar = ({ followers }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>팔로워 목록</div>
      <ul className={styles.list}>
        {followers.map((f) => (
          <li key={f.followsId} className={styles.item}>
            <img src={f.profile} alt="프로필" className={styles.avatar} />
            <span className={styles.nickname}>{f.nickname}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowerSidebar;
