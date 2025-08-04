import React, { useRef, useEffect } from 'react';
import './SearchHeader.css';

const SearchHeader = ({ query, onQueryChange, onClose, onSearch }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(query);
        }
    };

    return (
        <div className="search-header">
            <div className="search-input-container">
                <img src="/search.png" alt="검색" className="search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="검색"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    aria-label="검색어 입력"
                />
            </div>
            <button 
                className="close-button" 
                onClick={onClose}
                aria-label="검색 닫기"
            >
                ×
            </button>
        </div>
    );
};

export default SearchHeader; 