import React from 'react';
import ReactDOM from 'react-dom';
import { useUserSearch } from '../hooks/useUserSearch';
import styles from '../styles/userSearchModal.module.css';
import UserSearchInput from './UserSearchInput';
import UserSearchList from './UserSearchList';

const UserSearchModal = ({ onClose }) => {
  const { query, setQuery, results, loading, error } = useUserSearch();
  const handleClose = onClose;

  // 팔로우 상태 변경 핸들러
  const handleFollowChange = (userId, isFollowing) => {
    console.log(`사용자 ${userId} ${isFollowing ? '팔로우' : '언팔로우'} 완료`);
    // 여기서 필요한 추가 로직을 구현할 수 있습니다
    // 예: 팔로우 목록 업데이트, 알림 표시 등
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>사용자 검색</h2>
        <UserSearchInput query={query} setQuery={setQuery} />
        <UserSearchList 
          loading={loading} 
          error={error} 
          results={results} 
          query={query} 
          onFollowChange={handleFollowChange}
        />
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
      </div>
    </div>,
    document.body
  );
};

export default UserSearchModal; 