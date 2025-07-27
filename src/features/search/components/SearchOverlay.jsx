import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import './SearchOverlay.css';

const SearchOverlay = ({ isVisible, onClose }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const { suggestions, loading, error, fetchSuggestions } = useSearchSuggestions();

    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus();
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

    const handleClose = () => {
        setQuery('');
        setIsSearching(false);
        onClose();
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
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
            // navigate({ to: '/search', search: { term: searchTerm.trim() } });
            handleClose();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // handleSearch(suggestion.folderName);
    };

    return (
        <div className={`search-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="search-overlay-backdrop" onClick={handleClose} />
            <div className="search-overlay-content">
                <div className="search-header">
                    <div className="search-input-container">
                        <img src="/search.png" alt="검색" className="search-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-input"
                            placeholder="검색어를 입력하세요"
                            value={query}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            aria-label="검색어 입력"
                        />
                    </div>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        aria-label="검색 닫기"
                    >
                        ×
                    </button>
                </div>

                <div className="search-content">
                    {!isSearching && (
                        <div className="recent-searches">
                            <h3 className="section-title">최근 검색</h3>
                            <div className="search-history">
                                <div className="search-item" onClick={() => {/* handleSearch('대전여행') */}}>
                                    <span className="clock-icon">🕐</span>
                                    <span className="search-term">대전여행</span>
                                    <button className="remove-btn" aria-label="검색 기록 삭제">×</button>
                                </div>
                                <div className="search-item" onClick={() => {/* handleSearch('서울맛집') */}}>
                                    <span className="clock-icon">🕐</span>
                                    <span className="search-term">서울맛집</span>
                                    <button className="remove-btn" aria-label="검색 기록 삭제">×</button>
                                </div>
                                <div className="search-item" onClick={() => {/* handleSearch('부산여행') */}}>
                                    <span className="clock-icon">🕐</span>
                                    <span className="search-term">부산여행</span>
                                    <button className="remove-btn" aria-label="검색 기록 삭제">×</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isSearching && (
                        <div className="search-results">
                            <h3 className="section-title">
                                {loading ? '검색 중...' : `검색 결과 (${suggestions.length})`}
                            </h3>
                            
                            {loading && (
                                <div className="loading-suggestions">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="suggestion-skeleton">
                                            <div className="skeleton-avatar"></div>
                                            <div className="skeleton-content">
                                                <div className="skeleton-title"></div>
                                                <div className="skeleton-description"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && suggestions.length > 0 && (
                                <div className="suggestions-list">
                                    {suggestions.map((suggestion) => (
                                        <div 
                                            key={suggestion.folderId} 
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSuggestionClick(suggestion);
                                                }
                                            }}
                                            role="button"
                                            aria-label={`${suggestion.folderName} 선택`}
                                        >
                                            <div className="suggestion-avatar">
                                                <img 
                                                    src={suggestion.profileImage || '/public/account_circle.png'} 
                                                    alt={suggestion.nickname}
                                                    onError={(e) => {
                                                        e.target.src = '/public/account_circle.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="suggestion-content">
                                                <div className="suggestion-title">{suggestion.folderName}</div>
                                                <div className="suggestion-description">{suggestion.folderDescription}</div>
                                                <div className="suggestion-meta">
                                                    <span className="suggestion-author">{suggestion.nickname}</span>
                                                    <span className="suggestion-stats">
                                                        조회 {suggestion.viewCount} • 스크랩 {suggestion.scrapCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && suggestions.length === 0 && query.trim() && (
                                <div className="no-results">
                                    <p>"{query}"에 대한 검색 결과가 없습니다.</p>
                                    <p>다른 검색어를 시도해보세요.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay; 