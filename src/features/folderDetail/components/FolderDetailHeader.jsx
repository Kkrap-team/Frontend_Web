import React from 'react';
import '../styles/FolderDetailHeader.css';

const FolderHeader = ({ folderInfo }) => {
    if (!folderInfo) return null;

    return (
        <div className="FolderDetailHeader">
            <h1 className="FolderDetailTitle">{folderInfo.folderName}</h1>
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
