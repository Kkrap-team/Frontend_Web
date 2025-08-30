import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { getRankings } from '../api/searchApi';
import SearchHeader from './SearchHeader';
import SearchResultSection from './SearchResultSection';
import SortedRankingSection from './SortedRankingSection';
import styles from '../styles/SearchOverlay.module.css';

const SearchOverlay = ({ isVisible, onClose }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [rankings, setRankings] = useState(null);
    const [rankingsLoading, setRankingsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { suggestions, loading, error, fetchSuggestions } = useSearchSuggestions();
    const { recentSearches, addSearchTerm, removeSearchTerm, clearAllSearches } = useRecentSearches();

    useEffect(() => {
        if (isVisible) {
            fetchRankings();
        }
    }, [isVisible]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible]);

    const fetchRankings = async () => {
        try {
            setRankingsLoading(true);
            const data = await getRankings();
            setRankings(data);
        } catch (error) {
            console.error('랭킹 데이터 가져오기 오류:', error);
        } finally {
            setRankingsLoading(false);
        }
    };

    const handleClose = () => {
        setQuery('');
        setIsSearching(false);
        onClose();
    };

    const handleQueryChange = (value) => {
        setQuery(value);
        
        if (value.trim()) {
            setIsSearching(true);
            fetchSuggestions(value);
        } else {
            setIsSearching(false);
        }
    };

    const handleSearch = (searchTerm = query) => {
        if (searchTerm.trim()) {
            // 최근 검색어에 추가
            addSearchTerm(searchTerm);
            // 먼저 검색 오버레이를 닫고 페이지 이동
            handleClose();
            // 약간의 지연 후 페이지 이동하여 상태 업데이트가 완료되도록 함
            setTimeout(() => {
                navigate({ to: '/search', search: { term: searchTerm.trim() } });
            }, 100);
        }
    };

    const handleSearchClick = (searchTerm) => {
        setQuery(searchTerm);
        // 먼저 검색 오버레이를 닫고 페이지 이동
        handleClose();
        // 약간의 지연 후 페이지 이동하여 상태 업데이트가 완료되도록 함
        setTimeout(() => {
            navigate({ to: '/search', search: { term: searchTerm.trim() } });
        }, 100);
    };

    const handleRemoveSearch = (searchToRemove) => {
        removeSearchTerm(searchToRemove);
    };

    const handlePreviewItemClick = (item) => {
        // 해당 폴더의 상세페이지로 이동
        if (item && item.folderId) {
            const targetUserIdParam = item.userId
                ? `&targetUserId=${item.userId}`
                : item.ownerUserId
                  ? `&targetUserId=${item.ownerUserId}`
                  : '';
            
            const url = `/folder/${item.folderId}?${targetUserIdParam}`;

            
            // 검색 오버레이 닫기
            handleClose();
            
            // 페이지 이동
            setTimeout(() => {
                navigate({ to: url });
            }, 100);
        }
    };

    return (
        <div className={`${styles.searchOverlay} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.searchOverlayContent}>
                <SearchHeader 
                    query={query}
                    onQueryChange={handleQueryChange}
                    onClose={handleClose}
                    onSearch={handleSearch}
                />

                {/* 검색 상태에 따른 조건부 렌더링 */}
                {!isSearching ? (
                    // 초기 상태: 최근 검색 + 랭킹
                    <>
                        <SearchResultSection 
                            recentSearches={recentSearches}
                            searchResults={[]}
                            searchLoading={false}
                            isSearching={isSearching}
                            onSearchClick={handleSearchClick}
                            onRemoveSearch={handleRemoveSearch}
                            onClearAll={clearAllSearches}
                            onPreviewItemClick={handlePreviewItemClick}
                        />
                        <SortedRankingSection 
                            rankings={rankings}
                            loading={rankingsLoading}
                        />
                    </>
                ) : (
                    // 검색 중: 검색 결과만 표시
                    <SearchResultSection 
                        recentSearches={recentSearches}
                        searchResults={suggestions}
                        searchLoading={loading}
                        isSearching={isSearching}
                        onSearchClick={handleSearchClick}
                        onRemoveSearch={handleRemoveSearch}
                        onClearAll={clearAllSearches}
                        onPreviewItemClick={handlePreviewItemClick}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;