import React from 'react';
import styles from '../styles/userSearchModal.module.css';

const UserSearchInput = ({ query, setQuery }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="검색"
        className={styles.searchInput}
      />
    </div>
  );
};

export default UserSearchInput; 