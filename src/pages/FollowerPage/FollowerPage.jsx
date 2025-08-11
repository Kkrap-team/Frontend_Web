import React, { useContext } from "react";
import styles from "./FollowerPage.module.css";
import FollowerSidebar from "@/features/followingList/components/FollowerSidebar";
import { useFetchFollowingList } from "@/features/followingList/hooks/useFetchFollowingList";
import { useModal } from "@/contexts/ModalContext";
import { useAuthStore } from "@/stores/authStore";
import FollowContents from "@/features/followContents/components/FollowContents";

const FollowerPage = () => {
  const { user } = useAuthStore();
  const userId = user.userId;
  const { data: followers, loading, error } = useFetchFollowingList({ userId });
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
            <FollowContents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerPage;
