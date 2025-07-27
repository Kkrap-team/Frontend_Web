import React, { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { searchFolders } from '../../features/search/api/searchApi';
import './SearchPage.css';

const SearchPage = () => {
    const search = useSearch();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const searchTerm = search.term;

    useEffect(() => {
        if (searchTerm) {
            fetchSearchResults(searchTerm);
        }
    }, [searchTerm]);

    const fetchSearchResults = async (term) => {
        try {
            setLoading(true);
            setError(null);
            const data = await searchFolders(term);
            setResults(data || []);
        } catch (err) {
            console.error('검색 결과 가져오기 오류:', err);
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    if (!searchTerm) {
        return (
            <div className="search-page">
                <div className="no-search-term">
                    <h2>검색어를 입력해주세요</h2>
                    <p>검색어를 입력하면 관련 결과를 찾아드립니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page">
            <div className="search-page-header">
                <h1 className="search-title">
                    "{searchTerm}" 검색 결과
                </h1>
                <p className="search-subtitle">
                    {loading ? '검색 중...' : `${results.length}개의 결과를 찾았습니다.`}
                </p>
            </div>

            <div className="search-page-content">
                {loading && (
                    <div className="loading-results">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="result-skeleton">
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-description"></div>
                                    <div className="skeleton-meta"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="error-message">
                        <p>검색 중 오류가 발생했습니다: {error}</p>
                        <button 
                            onClick={() => fetchSearchResults(searchTerm)}
                            className="retry-button"
                        >
                            다시 시도
                        </button>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <div className="search-results">
                        {results.map((result) => (
                            <div key={result.folderId} className="search-result-item">
                                <div className="result-avatar">
                                    <img 
                                        src={result.profileImage || '/public/account_circle.png'} 
                                        alt={result.nickname}
                                        onError={(e) => {
                                            e.target.src = '/public/account_circle.png';
                                        }}
                                    />
                                </div>
                                <div className="result-content">
                                    <h3 className="result-title">{result.folderName}</h3>
                                    <p className="result-description">{result.folderDescription}</p>
                                    <div className="result-meta">
                                        <span className="result-author">{result.nickname}</span>
                                        <span className="result-stats">
                                            조회 {result.viewCount} • 스크랩 {result.scrapCount}
                                        </span>
                                        <span className="result-date">
                                            {new Date(result.createTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h2>검색 결과가 없습니다</h2>
                        <p>"{searchTerm}"에 대한 검색 결과를 찾을 수 없습니다.</p>
                        <p>다른 검색어를 시도해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage; 