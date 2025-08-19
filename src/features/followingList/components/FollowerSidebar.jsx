import React, { useState } from "react";
import styles from '../styles/followerSidebar.module.css';
import FollowerProfileBox from "./FollowerProfileBox";
import FollowerSearchBar from "./FollowerSearchBar";

const FollowerSidebar = ({ followers = [] }) => {
  const [searchText, setSearchText] = useState("");

  // 실시간 필터링 (안전한 필터링)
  const filteredFollowers = Array.isArray(followers) 
    ? followers.filter((f) => {
        if (!f || typeof f !== 'object') return false;
        if (!f.nickname || typeof f.nickname !== 'string') return false;
        return f.nickname.toLowerCase().includes(searchText.toLowerCase());
      })
    : [];

  return (
    <div className={styles.sidebarContainer}>
      {/* 검색바 영역 - 항상 표시 */}
      <div className={styles.headerArea}>
        <FollowerSearchBar
          searchText={searchText}
          onChange={setSearchText}
        />
      </div>

      {/* 프로필 리스트 영역 - 조건부 컨텐츠 */}
      <div className={styles.profileList}>
        {!Array.isArray(followers) ? (
          // 데이터가 배열이 아닌 경우
          <div className={styles.emptyState}>
            <p>팔로워 데이터를 불러올 수 없습니다.</p>
          </div>
        ) : filteredFollowers.length === 0 ? (
          // 검색 결과가 없거나 팔로워가 없는 경우
          <div className={styles.emptyState}>
            <p>{searchText ? '검색 결과가 없습니다.' : '팔로워가 없습니다.'}</p>
          </div>
        ) : (
          // 정상적인 팔로워 목록 표시
          filteredFollowers.map((f) => (
            <FollowerProfileBox key={f.followingId || f.userId || Math.random()} follower={f} />
          ))
        )}
      </div>
    </div>
  );
};

export default FollowerSidebar;
