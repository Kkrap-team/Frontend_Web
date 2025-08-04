import React from 'react';
import './RecentSearchPanel.css';

const RecentSearchPanel = ({ recentSearches, onSearchClick, onRemoveSearch }) => {
    return (
        <div className="recent-search-panel">
            <h3 className="recent-search-title">최근 검색</h3>
            <ul className="recent-search-list">
                {recentSearches.map((search, index) => (
                    <li key={index} className="recent-search-item">
                        <div 
                            className="recent-search-text"
                            onClick={() => onSearchClick(search)}
                        >
                            <span className="recent-search-icon">🕐</span>
                            <span className="recent-search-term">{search}</span>
                        </div>
                        <button 
                            className="recent-search-remove"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSearch(search);
                            }}
                            aria-label="검색 기록 삭제"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentSearchPanel; 