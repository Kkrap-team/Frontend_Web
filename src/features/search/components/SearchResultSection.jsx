import React from 'react';
import RecentSearchPanel from './RecentSearchPanel';
import SearchPreviewList from './SearchPreviewList';
import styles from '../styles/SearchResultSection.module.css';

const SearchResultSection = ({ 
    recentSearches, 
    searchResults, 
    searchLoading, 
    onSearchClick, 
    onRemoveSearch, 
    onPreviewItemClick 
}) => {
    return (
        <div className={styles.searchResultSection}>
            <RecentSearchPanel 
                recentSearches={recentSearches}
                onSearchClick={onSearchClick}
                onRemoveSearch={onRemoveSearch}
            />
            <SearchPreviewList 
                results={searchResults}
                loading={searchLoading}
                onItemClick={onPreviewItemClick}
            />
        </div>
    );
};

export default SearchResultSection; 