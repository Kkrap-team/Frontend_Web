import React from 'react';
import FollowerSidebar from './FollowerSidebar';
import styles from '../styles/FollowingListModal.module.css';

const FollowingListModal = ({ followers, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>팔로잉 목록</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <FollowerSidebar followers={followers} />
        </div>
      </div>
    </div>
  );
};

export default FollowingListModal;
