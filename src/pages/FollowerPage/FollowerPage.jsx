import React from "react";
import styles from './FollowerPage.module.css';
import FollowerSidebar from "@/features/followingList/components/FollowerSidebar";
import { useFetchFollowingList } from "@/features/followingList/hooks/useFetchFollowingList";


const FollowerPage = () => {
    const {data : followers, loading, error} = useFetchFollowingList({ userId : 5}); //TODO : 실제 userId 변경 예정

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생 : follower Page</div>;


    return (
    <div className={styles.container}>
      <FollowerSidebar followers={followers} />
      <div className={styles.contentArea}>팔로워 콘텐츠 표시 예정.</div>
    </div>
  );



};

export default FollowerPage;