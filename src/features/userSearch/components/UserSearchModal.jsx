import React from 'react';
import ReactDOM from 'react-dom';
import { useUserSearch } from '../hooks/useUserSearch';
import styles from '../styles/userSearchModal.module.css';
import UserSearchInput from './UserSearchInput';
import UserSearchList from './UserSearchList';

const UserSearchModal = ({ onClose }) => {
  const { query, setQuery, results, loading, error } = useUserSearch();
  const handleClose = onClose;

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
        />
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
      </div>
    </div>,
    document.body
  );
};

export default UserSearchModal; 