import React from 'react';
import './SortedResultsSection.css';

const SortedResultsSection = ({ rankings, loading }) => {
    if (loading) {
        return (
            <div className="sorted-results-section">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>랭킹 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sorted-results-section">
            <div className="sorted-section">
                <h3 className="sorted-title">조회순</h3>
                <div className="sorted-content">
                    {rankings?.topViewCount?.length > 0 ? (
                        rankings.topViewCount.map((item) => (
                            <div key={item.folderId} className="sorted-item">
                                <div className="sorted-avatar">
                                    <img 
                                        src={item.profileImage || '/public/account_circle.png'} 
                                        alt={item.nickname}
                                        onError={(e) => {
                                            e.target.src = '/public/account_circle.png';
                                        }}
                                    />
                                </div>
                                <div className="sorted-item-content">
                                    <h4 className="sorted-item-title">{item.folderName}</h4>
                                    <p className="sorted-item-description">{item.folderDescription}</p>
                                    <div className="sorted-item-meta">
                                        <span className="sorted-item-author">{item.nickname}</span>
                                        <span className="sorted-item-stats">
                                            조회 {item.viewCount} • 스크랩 {item.scrapCount}
                                        </span>
                                        <span className="sorted-item-date">
                                            {new Date(item.createTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-sorted-results">
                            <p>조회순 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sorted-section">
                <h3 className="sorted-title">스크랩 순</h3>
                <div className="sorted-content">
                    {rankings?.topscrapCount?.length > 0 ? (
                        rankings.topscrapCount.map((item) => (
                            <div key={item.folderId} className="sorted-item">
                                <div className="sorted-avatar">
                                    <img 
                                        src={item.profileImage || '/public/account_circle.png'} 
                                        alt={item.nickname}
                                        onError={(e) => {
                                            e.target.src = '/public/account_circle.png';
                                        }}
                                    />
                                </div>
                                <div className="sorted-item-content">
                                    <h4 className="sorted-item-title">{item.folderName}</h4>
                                    <p className="sorted-item-description">{item.folderDescription}</p>
                                    <div className="sorted-item-meta">
                                        <span className="sorted-item-author">{item.nickname}</span>
                                        <span className="sorted-item-stats">
                                            조회 {item.viewCount} • 스크랩 {item.scrapCount}
                                        </span>
                                        <span className="sorted-item-date">
                                            {new Date(item.createTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-sorted-results">
                            <p>스크랩 순 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SortedResultsSection; 