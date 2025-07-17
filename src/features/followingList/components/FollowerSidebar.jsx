import React, { useState } from "react";
import styles from '../styles/followerSidebar.module.css';
import FollowerProfileBox from "./FollowerProfileBox";
import FollowerSearchBar from "./FollowerSearchBar";

const FollowerSidebar = ({ followers }) => {
  const [searchText, setSearchText] = useState("");

  // 실시간 필터링
  const filteredFollowers = followers.filter((f) =>
    f.nickname.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.sidebarContainer}>
      {/* 검색바 영역 */}
      <div className={styles.headerArea}>
        <FollowerSearchBar
          searchText={searchText}
          onChange={setSearchText}
        />
      </div>

      {/* 프로필 리스트 영역 */}
      <div className={styles.profileList}>
        {filteredFollowers.map((f) => (
          <FollowerProfileBox key={f.followsId} follower={f} />
        ))}
      </div>
    </div>
  );
};

export default FollowerSidebar;
