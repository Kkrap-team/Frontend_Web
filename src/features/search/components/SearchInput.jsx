import React from 'react';
import './SearchInput.css';

export default function SearchInput() {
    return (
        <div className="search-input-wrapper">
            <img src="/search.png" alt="검색" className="search-icon" />
            <input
                type="text"
                className="search-input"
                placeholder="검색어를 입력하세요"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // 나중 백엔드 검색 API 호출하면될듯
                        console.log('검색어:', e.target.value);
                    }
                }}
            />
        </div>
    );
}
