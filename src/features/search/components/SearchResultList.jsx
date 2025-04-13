import React from 'react';

export default function SearchResultList({ results }) {
    if (results.length === 0) {
        return <p className="no-results">검색 결과가 없습니다.</p>;
    }

    return (
        <ul className="search-result-list">
            {results.map((item) => (
                <li key={item.id} className="search-result-item">
                    {item.title}
                </li>
            ))}
        </ul>
    );
}
