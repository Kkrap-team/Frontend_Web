import React, { useState } from 'react';
import '@/features/storage/styles/MyFolderCard.css';

const MyFolderCard = ({ folder, onDelete }) => {
    const { folderName, folderDescription, links, defaultFolder, scrapCount, viewCount, visible } = folder;
    const [showMenu, setShowMenu] = useState(false);
    // 대표 썸네일: links 배열의 첫 번째 썸네일(없으면 기본 이미지)
    const thumbnail =
        links && links.length > 0
            ? links[0].thumbnailUrl || links[0].faviconUrl || '/Kkrap_logo.png'
            : '/Kkrap_logo.png';

    return (
        <div className="MyFolderCard">
            {defaultFolder ? (
                <div className="MultiThumbnailGrid">
                    {(links || []).map((link, idx) => (
                        <img
                            key={link.linkId || idx}
                            className="MultiThumbnail"
                            src={link.thumbnailUrl || link.faviconUrl || '/Kkrap_logo.png'}
                            alt={folderName}
                        />
                    ))}
                </div>
            ) : (
                <img className="MyFolderImage" src={thumbnail} alt={folderName} />
            )}
            <div className="MyFolderInfo">
                <div className="MyFolderHeader">
                    <div className="MyFolderTitle">{folderName}</div>
                    <div className="MoreWrapper">
                        <button className="MoreBtn" onClick={() => setShowMenu((prev) => !prev)}>
                            ⋮
                        </button>
                        {showMenu && (
                            <div className="DropdownMenu">
                                <button onClick={() => onDelete(folder)}>폴더 삭제</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="MyFolderDesc">{folderDescription}</div>

                <div className="MyFolderStats">
                    <div className="MyFolderStatsLeft">
                        <div className="MyFolderScrap">
                            <img src="/scrap_icon.png" alt="스크랩" /> {scrapCount}
                        </div>
                        <div className="MyFolderView">
                            <img src="/view_icon.png" alt="조회수" /> {viewCount}
                        </div>
                    </div>

                    <div className="MyFolderVisible">
                        <img
                            src={visible ? '/visible_icon.png' : '/invisible_icon.png'}
                            alt={visible ? '공개' : '비공개'}
                        />
                        {visible ? '공개' : '비공개'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyFolderCard;
