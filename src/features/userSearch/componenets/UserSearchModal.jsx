import React from 'react';
import ReactDOM from 'react-dom';
import { useUserSearch } from '../hooks/useUserSearch';
import styles from '../styles/userSearchModal.module.css';
import FollowerProfileBox from '../../followingList/components/FollowerProfileBox';
import { useModal } from '../../../contexts/ModalContext';

const UserSearchModal = ({ onClose }) => {
  const { query, setQuery, results, loading, error } = useUserSearch();
  const handleClose = onClose;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>사용자 검색</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="검색"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.list}>
          {loading && <p className={styles.loadingText}>로딩 중...</p>}
          {error && <p className={styles.errorText}>오류: {error}</p>}
          {!loading && !error && results.map(user => (
            <div key={user.userId} className={styles.row}>
              <div className={styles.userInfo}>
                <div className={styles.profileImage}>
                  <img 
                    src={user.profile || '/public/account_circle.png'} 
                    alt={user.nickname}
                    onError={(e) => {
                      e.target.src = '/public/account_circle.png';
                    }}
                  />
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.nickname}>{user.nickname}</div>
                  <div className={styles.email}>{user.email || '이메일 없음'}</div>
                </div>
              </div>
              <button className={styles.addBtn}>＋</button>
            </div>
          ))}
          {!loading && !error && !results.length && query && <p className={styles.noResults}>검색 결과가 없습니다.</p>}
        </div>
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
      </div>
    </div>,
    document.body
  );
};

export default UserSearchModal;
