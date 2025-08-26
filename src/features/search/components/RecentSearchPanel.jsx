import React from 'react';
import styles from '../styles/RecentSearchPanel.module.css';

const RecentSearchPanel = ({ recentSearches, onSearchClick, onRemoveSearch, onClearAll }) => {
    return (
        <div className={styles.recentSearchPanel}>
            <div className={styles.recentSearchHeader}>
                <h3 className={styles.recentSearchTitle}>최근 검색</h3>
                {recentSearches.length > 0 && (
                    <button 
                        className={styles.clearAllButton}
                        onClick={onClearAll}
                        aria-label="모든 검색어 삭제"
                    >
                        전체 삭제
                    </button>
                )}
            </div>
            
            {recentSearches.length > 0 ? (
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
            ) : (
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateText}>검색 기록이 없습니다</p>
                    <p className={styles.emptyStateSubtext}>검색어를 입력하면 여기에 기록됩니다</p>
                </div>
            )}
        </div>
    );
};

export default RecentSearchPanel; 