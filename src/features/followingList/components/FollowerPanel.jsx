// src/features/followingList/components/FollowerPanel.jsx
//TODO : 삭제 예정 파일입니다.
import React, { useEffect, useRef } from 'react';
import { useFetchFollowingList } from '../hooks/useFetchFollowingList';
import FollowerSidebar from './FollowerSidebar';
import styles from '../styles/followerPanel.module.css';

const FollowerPanel = ({ userId, onClose }) => {
  const { followers, loading, loadFollowers } = useFetchFollowingList();
  const panelRef = useRef();

  useEffect(() => {
    loadFollowers(userId);
  }, [userId, loadFollowers]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.overlay}>
      <div className={styles.sidebarWrapper} ref={panelRef}>
        <FollowerSidebar followers={followers} />
      </div>
    </div>
  );
};

export default FollowerPanel;
