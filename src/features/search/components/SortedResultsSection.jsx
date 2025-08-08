import React from 'react';
import styles from '../styles/SortedResultsSection.module.css';

const SortedResultsSection = ({ rankings, loading }) => {
    if (loading) {
        return (
            <div className={styles.sortedResultsSection}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>랭킹 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sortedResultsSection}>
            <div className={styles.sortedSection}>
                <h3 className={styles.sortedTitle}>조회순</h3>
                <div className={styles.sortedContent}>
                    {rankings?.topViewCount?.length > 0 ? (
                        rankings.topViewCount.map((item) => (
                            <div key={item.folderId} className={styles.sortedItem}>
                                <div className={styles.sortedAvatar}>
                                    <img 
                                        src={item.profileImage || '/public/account_circle.png'} 
                                        alt={item.nickname}
                                        onError={(e) => {
                                            e.target.src = '/public/account_circle.png';
                                        }}
                                    />
                                </div>
                                <div className={styles.sortedItemContent}>
                                    <h4 className={styles.sortedItemTitle}>{item.folderName}</h4>
                                    <p className={styles.sortedItemDescription}>{item.folderDescription}</p>
                                    <div className={styles.sortedItemMeta}>
                                        <span className={styles.sortedItemAuthor}>{item.nickname}</span>
                                        <span className={styles.sortedItemStats}>
                                            조회 {item.viewCount} • 스크랩 {item.scrapCount}
                                        </span>
                                        <span className={styles.sortedItemDate}>
                                            {new Date(item.createTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noSortedResults}>
                            <p>조회순 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className={styles.sortedSection}>
                <h3 className={styles.sortedTitle}>스크랩 순</h3>
                <div className={styles.sortedContent}>
                    {rankings?.topscrapCount?.length > 0 ? (
                        rankings.topscrapCount.map((item) => (
                            <div key={item.folderId} className={styles.sortedItem}>
                                <div className={styles.sortedAvatar}>
                                    <img 
                                        src={item.profileImage || '/public/account_circle.png'} 
                                        alt={item.nickname}
                                        onError={(e) => {
                                            e.target.src = '/public/account_circle.png';
                                        }}
                                    />
                                </div>
                                <div className={styles.sortedItemContent}>
                                    <h4 className={styles.sortedItemTitle}>{item.folderName}</h4>
                                    <p className={styles.sortedItemDescription}>{item.folderDescription}</p>
                                    <div className={styles.sortedItemMeta}>
                                        <span className={styles.sortedItemAuthor}>{item.nickname}</span>
                                        <span className={styles.sortedItemStats}>
                                            조회 {item.viewCount} • 스크랩 {item.scrapCount}
                                        </span>
                                        <span className={styles.sortedItemDate}>
                                            {new Date(item.createTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noSortedResults}>
                            <p>스크랩 순 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SortedResultsSection; 