import React, { useRef, useEffect } from 'react';
import styles from '../styles/SearchHeader.module.css';

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
        <div className={styles.searchHeader}>
            <div className={styles.searchInputContainer}>
                <img src="/search.png" alt="검색" className={styles.searchIcon} />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="폴더 검색"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    aria-label="검색어 입력"
                />
            </div>
            <button 
                className={styles.closeButton} 
                onClick={onClose}
                aria-label="검색 닫기"
            >
                ×
            </button>
        </div>
    );
};

export default SearchHeader; 