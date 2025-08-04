import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { getRankings } from '../api/searchApi';
import SearchHeader from './SearchHeader';
import SearchResultSection from './SearchResultSection';
import SortedResultsSection from './SortedResultsSection';
import './SearchOverlay.css';

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
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
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
            // navigate({ to: '/search', search: { term: searchTerm.trim() } });
            handleClose();
        }
    };

    const handleSearchClick = (searchTerm) => {
        setQuery(searchTerm);
        handleSearch(searchTerm);
    };

    const handleRemoveSearch = (searchToRemove) => {
        setRecentSearches(prev => prev.filter(item => item !== searchToRemove));
    };

    const handlePreviewItemClick = (item) => {
        // 폴더 상세 페이지로 이동
        console.log('폴더 클릭:', item);
    };

    return (
        <div className={`search-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="search-overlay-content">
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
                        <SortedResultsSection 
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