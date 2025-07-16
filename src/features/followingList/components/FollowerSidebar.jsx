import React from "react";
import styles from '../styles/followerSidebar.module.css';
import FollowerProfileBox from "./FollowerProfileBox";

const FollowerSidebar = ({ followers }) => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.headerArea}>
        <div className={styles.searchBar}>
          <span className={styles.searchText}>팔로워 검색</span>
        </div>
      </div>

      <div className={styles.profileList}>
        {followers.map((follower) => (
          <FollowerProfileBox key={follower.followesId} follower={follower} />
        ))}
      </div>
    </div>
  );
};

export default FollowerSidebar;
