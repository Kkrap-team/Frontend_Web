import React from 'react';
import { useSearchPage } from '../../features/search/hooks/useSearchPage';
import MyFolderCard from '../../features/storage/components/MyFolderCard';
import './SearchPage.css';

const SearchPage = () => {
    const { results, loading, error, searchTerm, refetchResults } = useSearchPage();


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
                            onClick={refetchResults}
                            className="retry-button"
                        >
                            다시 시도
                        </button>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <div className="search-results-grid">
                        {results.map((result, index) => {
                            const folderData = {
                                folderId: result.folderId || result.id || `search-${index}`,
                                folderName: result.folderName || result.title || `폴더 ${index + 1}`,
                                folderDescription: result.folderDescription || result.description || '설명이 없습니다.',
                                links: result.imageUrl ? [{ thumbnailUrl: result.imageUrl }] : 
                                       result.thumbnailUrl ? [{ thumbnailUrl: result.thumbnailUrl }] :
                                       result.faviconUrl ? [{ faviconUrl: result.faviconUrl }] : [],
                                scrapCount: result.scrapCount || 0,
                                viewCount: result.viewCount || 0,
                                visible: true,
                                userId: result.userId || result.ownerUserId,
                                ownerUserId: result.ownerUserId || result.userId
                            };
                            
                        
                            
                            return (
                                <div key={result.folderId || result.id || index} className="search-result-card">
                                    <MyFolderCard
                                        folder={folderData}
                                        onDelete={() => {}}
                                        onEdit={() => {}}
                                        onPermission={() => {}}
                                        showMenu={false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="no-results">
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