import React from 'react';
import '../styles/FolderDetailHeader.css';

const FolderHeader = ({ folderInfo, isOwner = false, onSettingsClick }) => {
    if (!folderInfo) return null;

    return (
        <div className="FolderDetailHeader">
            <h1 className="FolderDetailTitle" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {folderInfo.folderName}
                {isOwner && (
                    <button
                        onClick={() => onSettingsClick?.()}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        aria-label="폴더 설정"
                        title="폴더 설정"
                    >
                        <img src="/setting_icon.png" alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
                    </button>
                )}
            </h1>
            <p className="FolderDetailDescription">{folderInfo.folderDescription}</p>
            <div className="FolderDetailStats">
                <span className="FolderDetailStat">조회수: {folderInfo.viewCount}</span>
                <span className="FolderDetailStat">스크랩: {folderInfo.scrapCount}</span>
                <span className="FolderDetailStat">
                    폴더 생성일: {new Date(folderInfo.createTime).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default FolderHeader;
