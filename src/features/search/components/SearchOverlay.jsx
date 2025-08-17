import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
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
    const [recentSearches, setRecentSearches] = useState([
        '부산여행',
        '부산 가볼만한 맛집',
        '제주도 가고싶다.'
    ]);
    
    const navigate = useNavigate();
    const { suggestions, loading, error, fetchSuggestions } = useSearchSuggestions();

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
            // 전체 페이지 스크롤을 막지 않도록 주석 처리
            // document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // document.body.style.overflow = 'unset';
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
            if (!recentSearches.includes(searchTerm)) {
                setRecentSearches(prev => [searchTerm, ...prev.slice(0, 2)]);
            }
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
        setRecentSearches(prev => prev.filter(item => item !== searchToRemove));
    };

    const handlePreviewItemClick = (item) => {
        // 해당 검색어 폴더 페이지로 이동
        console.log('폴더 클릭:', item);
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

                {!isSearching && (
                    <>
                        <SearchResultSection 
                            recentSearches={recentSearches}
                            searchResults={[]}
                            searchLoading={false}
                            onSearchClick={handleSearchClick}
                            onRemoveSearch={handleRemoveSearch}
                            onPreviewItemClick={handlePreviewItemClick}
                        />
                        <SortedRankingSection 
                            rankings={rankings}
                            loading={rankingsLoading}
                        />
                    </>
                )}

                {isSearching && (
                    <SearchResultSection 
                        recentSearches={recentSearches}
                        searchResults={suggestions}
                        searchLoading={loading}
                        onSearchClick={handleSearchClick}
                        onRemoveSearch={handleRemoveSearch}
                        onPreviewItemClick={handlePreviewItemClick}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchOverlay; 