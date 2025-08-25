import React, { useState } from "react";
import styles from "./FollowerPage.module.css";
import FollowerSidebar from "@/features/followingList/components/FollowerSidebar";
import { useFetchFollowingList } from "@/features/followingList/hooks/useFetchFollowingList";
import { useModal } from "@/contexts/ModalContext";
import { useAuthStore } from "@/stores/authStore";
import FollowContents from "@/features/followContents/components/FollowContents";

const FollowerPage = () => {
  const { user } = useAuthStore();
  const userId = user?.userId;
  const { data: followers, loading, error } = useFetchFollowingList({ userId });
  const { showModal } = useModal();
  
  // 사이드바 토글 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생 : follower Page - {error?.message || '알 수 없는 오류'}</div>;

  return (
    <div className={styles.container}>
      {/* 모바일 사이드바 오버레이 */}
      <div 
        className={`${styles.mobileSidebarOverlay} ${!isSidebarOpen ? styles.hidden : ''}`}
        onClick={closeSidebar}
      />
      
      <div className={styles.main}>
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <FollowerSidebar followers={followers} />
        </aside>

        <div className={styles.contentWrapper}>
          <div className={styles.contentHeader}>
            <button
              className={styles.followingListButton}
              onClick={toggleSidebar}
            >
              팔로잉 목록
            </button>
            
            <button
              className={styles.searchTrigger}
              onClick={() => showModal("userSearch")}
            >
              사용자 검색
            </button>
          </div>
          <div className={styles.contentArea}>
            <FollowContents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerPage;
