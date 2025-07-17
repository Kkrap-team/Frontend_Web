import styles from '../styles/followerProfileBox.module.css';
import React from "react";

const FollowerProfileBox = ({ follower }) => {
  return (
    <div className={styles.profileBox}>
      <div
        className={styles.profileImage}
        style={{
          backgroundImage: `url(${follower.profile || '/default-profile.png'})`,
        }}
      />
      <div className={styles.nickname}>{follower.nickname}</div>
    </div>
  );
};

export default FollowerProfileBox;
