import React from "react";
import styles from "./FollowerPage.module.css";
import FollowerSidebar from "@/features/followingList/components/FollowerSidebar";
import { useFetchFollowingList } from "@/features/followingList/hooks/useFetchFollowingList";
import { useModal } from "@/contexts/ModalContext";

const FollowerPage = () => {
  const { data: followers, loading, error } = useFetchFollowingList({ userId: 5 });
  const { showModal } = useModal();

  if (loading) return <div>로딩 중...</div>;
  if (error)   return <div>에러 발생 : follower Page</div>;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        
        <aside className={styles.sidebar}>
          <FollowerSidebar followers={followers} />
        </aside>

        <div className={styles.contentWrapper}>
          <div className={styles.contentHeader}>
            <button
              className={styles.searchTrigger}
              onClick={() => showModal("userSearch")}
            >
              사용자 검색
            </button>
          </div>
          <div className={styles.contentArea}>
            팔로워 콘텐츠 표시 예정.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerPage;
