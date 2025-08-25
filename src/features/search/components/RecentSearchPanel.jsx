import React from 'react';
import styles from '../styles/RecentSearchPanel.module.css';

const RecentSearchPanel = ({ recentSearches, onSearchClick, onRemoveSearch }) => {
    return (
        <div className={styles.recentSearchPanel}>
            <h3 className={styles.recentSearchTitle}>최근 검색</h3>
            <ul className={styles.recentSearchList}>
                {recentSearches.map((search, index) => (
                    <li key={index} className={styles.recentSearchItem}>
                        <div 
                            className={styles.recentSearchText}
                            onClick={() => onSearchClick(search)}
                        >
                            <span className={styles.recentSearchIcon}>🕐</span>
                            <span className={styles.recentSearchTerm}>{search}</span>
                        </div>
                        <button 
                            className={styles.recentSearchRemove}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSearch(search);
                            }}
                            aria-label="검색 기록 삭제"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentSearchPanel; 