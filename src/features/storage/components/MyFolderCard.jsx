import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import '@/features/storage/styles/MyFolderCard.css';

const MyFolderCard = ({ folder, onDelete, onEdit, onPermission, defaultFolderId }) => {
    const { folderId, folderName, folderDescription, links, defaultFolder, scrapCount, viewCount, visible } = folder;
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const cardRef = useRef(null);
    // 대표 썸네일: links 배열의 첫 번째 썸네일(없으면 기본 이미지)
    const thumbnail =
        links && links.length > 0
            ? links[0].thumbnailUrl || links[0].faviconUrl || '/Kkrap_logo.png'
            : '/Kkrap_logo.png';

    // 외부 클릭 감지해서 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleFolderClick = () => {
        // 메뉴가 열려있으면 메뉴만 닫고 페이지 이동하지 않음
        if (showMenu) {
            setShowMenu(false);
            return;
        }
        // defaultFolderId를 URL 파라미터로 전달
        const url = defaultFolderId
            ? `/storage/${folderId}?defaultFolderId=${defaultFolderId}`
            : `/storage/${folderId}`;
        navigate({ to: url });
    };

    return (
        <div className="MyFolderCard" ref={cardRef} onClick={handleFolderClick}>
            {defaultFolder ? (
                <div className="MultiThumbnailGrid">
                    {(links || []).map((link, idx) => (
                        <img
                            key={link.linkId || idx}
                            className="MultiThumbnail"
                            src={link.thumbnailUrl || link.faviconUrl || '/Kkrap_logo.png'}
                            alt={folderName}
                            onError={(e) => {
                                e.target.onError = null;
                                e.target.src = '/Kkrap_logo.png';
                            }}
                        />
                    ))}
                </div>
            ) : (
                <img
                    className="MyFolderImage"
                    src={thumbnail}
                    alt={folderName}
                    onError={(e) => {
                        e.target.onError = null;
                        e.target.src = '/Kkrap_logo.png';
                    }}
                />
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
