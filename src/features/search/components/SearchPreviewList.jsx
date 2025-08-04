import React from 'react';
import './SearchPreviewList.css';

const SearchPreviewList = ({ results, loading, onItemClick }) => {
    return (
        <div className="search-preview-list">
            <div className="preview-header">
                <h3 className="preview-title">
                    {loading ? '검색 중...' : `검색 결과 (${results.length})`}
                </h3>
            </div>
            <div className="preview-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>검색 중입니다...</p>
                    </div>
                ) : results.length > 0 ? (
                    results.map((result) => (
                        <div 
                            key={result.folderId} 
                            className="preview-item"
                            onClick={() => onItemClick(result)}
                        >
                            <div className="preview-avatar">
                                <img 
                                    src={result.profileImage || '/public/account_circle.png'} 
                                    alt={result.nickname}
                                    onError={(e) => {
                                        e.target.src = '/public/account_circle.png';
                                    }}
                                />
                            </div>
                            <div className="preview-item-content">
                                <h4 className="preview-title">{result.folderName}</h4>
                                <p className="preview-description">{result.folderDescription}</p>
                                <div className="preview-meta">
                                    <span className="preview-author">{result.nickname}</span>
                                    <span className="preview-stats">
                                        조회 {result.viewCount} • 스크랩 {result.scrapCount}
                                    </span>
                                    <span className="preview-date">
                                        {new Date(result.createTime).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-preview-results">
                        <p>검색 결과가 없습니다.</p>
                        <p className="no-results-hint">다른 키워드로 검색해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPreviewList; 