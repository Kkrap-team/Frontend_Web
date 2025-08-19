import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import '@/features/storage/styles/MyFolderCard.css';


const MyFolderCard = ({ folder, onDelete, onEdit, onPermission, allFolders, showMenu = true, showLockIcon = false }) => {

    const { folderId, folderName, folderDescription, links, defaultFolder, scrapCount, viewCount, visible, share } = folder;
    console.log("째2 : ", links)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const cardRef = useRef(null);
    // 대표 썸네일: links 배열의 첫 번째 썸네일(없으면 기본 이미지)
    const thumbnail =
        links && links.length > 0
            ? links[0].thumbnailUrl || links[0].faviconUrl || '/Kkrap_logo_large.png'
            : '/Kkrap_logo_large.png';

    // 외부 클릭 감지해서 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleFolderClick = () => {
        // 메뉴가 열려있으면 메뉴만 닫고 페이지 이동하지 않음
        if (isMenuOpen) {
            setIsMenuOpen(false);
            return;
        }

        const targetUserIdParam = folder.userId
            ? `&targetUserId=${folder.userId}`
            : folder.ownerUserId
              ? `&targetUserId=${folder.ownerUserId}`
              : '';

        const url = `/folder/${folderId}?${targetUserIdParam}`;
        console.log('타겟유저아이디', targetUserIdParam);
        console.log('MyFolderCard generated URL:', url);

        navigate({ to: url });
    };

    return (
        <div className="MyFolderCard" ref={cardRef} onClick={handleFolderClick}>
            {/* 상단 이미지 영역 */}
            <div className="MyFolderImageContainer">
                {share ? (
                    <div className="MultiThumbnailGrid">
                        {(links || []).map((link, idx) => (
                            <img
                                key={link.linkId || idx}
                                className="MultiThumbnail"
                                src={link.thumbnailUrl || link.faviconUrl || '/Kkrap_logo_large.png'}
                                alt={folderName}
                                onError={(e) => {
                                    e.target.onError = null;
                                    e.target.src = '/Kkrap_logo_large.png';
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
                            e.target.src = '/Kkrap_logo_large.png';
                        }}
                    />
                )}
                {/* 자물쇠 아이콘 */}
                {showLockIcon && (
                    <div className="MyFolderLock">
                        <img
                            src={visible ? '/visible_icon.png' : '/invisible_icon.png'}
                            alt={visible ? '공개' : '비공개'}
                        />
                    </div>
                )}
            </div>

            {/* 하단 콘텐츠 영역 */}
            <div className="MyFolderInfo">
                <div className="MyFolderHeader">
                    <div className="MyFolderTitle">{folderName}</div>
                    {showMenu && (
                        <div className="MoreWrapper">
                            <button
                                className="MoreBtn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen((prev) => !prev);
                                }}
                            >
                                ⋮
                            </button>
                            {isMenuOpen && (
                                <div className="FolderMenuOverlay" onClick={() => setIsMenuOpen(false)}>
                                    <div className="FolderMenu" onClick={(e) => e.stopPropagation()}>
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
                    )}
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
                </div>
            </div>
        </div>
    );
};

export default MyFolderCard;
