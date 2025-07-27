import React from 'react';
import styles from '../styles/userSearchModal.module.css';

const UserSearchSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <div className={styles.skeletonUserInfo}>
            <div className={styles.skeletonProfileImage}></div>
            <div className={styles.skeletonUserDetails}>
              <div className={styles.skeletonNickname}></div>
              <div className={styles.skeletonEmail}></div>
            </div>
          </div>
          <div className={styles.skeletonAddBtn}></div>
        </div>
      ))}
    </div>
  );
};

export default UserSearchSkeleton; 