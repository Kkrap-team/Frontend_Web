import React from 'react';
import styles from '../styles/userSearchModal.module.css';
import UserSearchSkeleton from './UserSearchSkeleton';
import UserSearchResult from './UserSearchResult';

const UserSearchList = ({ loading, error, results, query, onFollowChange }) => {
  if (loading) {
    return <UserSearchSkeleton />;
  }

  if (error) {
    return <p className={styles.errorText}>오류: {error}</p>;
  }

  if (!results.length && query) {
    return <p className={styles.noResults}>검색 결과가 없습니다.</p>;
  }

  return (
    <div className={styles.list}>
      {results.map(user => (
        <UserSearchResult 
          key={user.userId} 
          user={user} 
          onFollowChange={onFollowChange}
        />
      ))}
    </div>
  );
};

export default UserSearchList; 