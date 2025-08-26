import React from 'react';
import RecentSearchPanel from './RecentSearchPanel';
import SearchPreviewList from './SearchPreviewList';
import styles from '../styles/SearchResultSection.module.css';

const SearchResultSection = ({ 
    recentSearches, 
    searchResults, 
    searchLoading, 
    isSearching,
    onSearchClick, 
    onRemoveSearch, 
    onClearAll,
    onPreviewItemClick 
}) => {
    return (
        <div className={styles.searchResultSection}>
            {!isSearching ? (
                // 초기 상태: 최근 검색만 표시
                <RecentSearchPanel 
                    recentSearches={recentSearches}
                    onSearchClick={onSearchClick}
                    onRemoveSearch={onRemoveSearch}
                    onClearAll={onClearAll}
                />
            ) : (
                // 검색 중: 검색 결과 프리뷰 표시
                <SearchPreviewList 
                    results={searchResults}
                    loading={searchLoading}
                    onItemClick={onPreviewItemClick}
                />
            )}
        </div>
    );
};

export default SearchResultSection; 