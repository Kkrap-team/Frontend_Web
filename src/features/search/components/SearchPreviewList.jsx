import React from 'react';
import styles from '../styles/SearchPreviewList.module.css';

const SearchPreviewList = ({ results, loading, onItemClick }) => {
    return (
        <div className={styles.searchPreviewList}>
            <div className={styles.previewHeader}>
                <h3 className={styles.previewTitle}>
                    {loading ? '검색 중...' : `검색 결과 (${results.length})`}
                </h3>
            </div>
            <div className={styles.previewContent}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p>검색 중입니다...</p>
                    </div>
                ) : results.length > 0 ? (
                    results.map((result) => (
                        <div 
                            key={result.folderId} 
                            className={styles.previewItem}
                            onClick={() => onItemClick(result)}
                        >
                            <div className={styles.previewAvatar}>
                                <img 
                                    src={result.profileImage || '/public/account_circle.png'} 
                                    alt={result.nickname}
                                    onError={(e) => {
                                        e.target.src = '/public/account_circle.png';
                                    }}
                                />
                            </div>
                            <div className={styles.previewItemContent}>
                                <h4 className={styles.previewTitle}>{result.folderName}</h4>
                                <p className={styles.previewDescription}>{result.folderDescription}</p>
                                <div className={styles.previewMeta}>
                                    <span className={styles.previewAuthor}>{result.nickname}</span>
                                    <span className={styles.previewStats}>
                                        조회 {result.viewCount} • 스크랩 {result.scrapCount}
                                    </span>
                                    <span className={styles.previewDate}>
                                        {new Date(result.createTime).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noPreviewResults}>
                        <p>검색 결과가 없습니다.</p>
                        <p className={styles.noResultsHint}>다른 키워드로 검색해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPreviewList; 