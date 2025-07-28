import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import '@/features/storage/styles/MyFolderCard.css';

const MyFolderCard = ({ folder, onDelete, onEdit, onPermission }) => {
    const { folderId, folderName, folderDescription, links, defaultFolder, scrapCount, viewCount, visible } = folder;
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    // 대표 썸네일: links 배열의 첫 번째 썸네일(없으면 기본 이미지)
    const thumbnail =
        links && links.length > 0
            ? links[0].thumbnailUrl || links[0].faviconUrl || '/Kkrap_logo.png'
            : '/Kkrap_logo.png';

    const handleFolderClick = () => {
        navigate({ to: `/storage/${folderId}` });
    };

    return (
        <div className="MyFolderCard" onClick={handleFolderClick}>
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
                        <button
                            className="MoreBtn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu((prev) => !prev);
                            }}
                        >
                            ⋮
                        </button>
                        {showMenu && (
                            <div
                                className="FolderMenuOverlay"
                                onClick={() => setShowMenu(false)} //메뉴 바깥(오버레이) 클릭 -> 메뉴 닫힘
                            >
                                <div
                                    className="FolderMenu"
                                    onClick={(e) => e.stopPropagation()} // 메뉴 안쪽 클릭 -> 메뉴는 안 닫힘 (버튼 동작만 실행)
                                >
                                    <button className="FolderMenuItem" onClick={() => onEdit(folder)}>
                                        <img className="FolderMenuIcon" src="/edit_folder.png" alt="수정" />
                                        폴더 수정하기
                                    </button>
                                    <button className="FolderMenuItem" onClick={() => onPermission(folder)}>
                                        <img className="FolderMenuIcon" src="/folder_permission.png" alt="권한" />
                                        폴더 권한 제어
                                    </button>
                                    <button
                                        className="FolderMenuItem FolderMenuDelete"
                                        onClick={() => onDelete(folder)}
                                    >
                                        <img className="FolderMenuIcon" src="/delete.png" alt="삭제" />
                                        삭제하기
                                    </button>
                                </div>
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
