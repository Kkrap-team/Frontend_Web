import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { formatRelativeKorean } from '@/utils/formatRelativeTime';

const UserFolderCardHeader = ({
    displayName = '사용자',
    avatarSrc = '/Kkrap_logo.png',
    onMoreClick,
    showMoreButton = true,
    onScrap,
    folderData,
    disabled = false,
    userFolderCreateTime,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // 외부 클릭 감지해서 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleMoreClick = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleScrapClick = () => {
        if (onScrap && folderData && !disabled) {
            onScrap(folderData);
        }
        setShowDropdown(false);
    };

    const handleProfileClick = () => {
        if (folderData?.userId) {
            navigate({ to: `/storage/${folderData.userId}` });
        }
    };

    return (
        <div className="UserFolderCardHeader">
            <div className="UserFolderCardInfo">
                <img
                    className="UserFolderCardAvatar"
                    src={avatarSrc}
                    alt="user"
                    onClick={handleProfileClick}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/Kkrap_logo.png';
                    }}
                />
                <div className="UserFolderCardText">
                    <span className="UserFolderCardName">{displayName}</span>
                    {userFolderCreateTime && (
                        <span className="UserFolderCardCreateTime">{formatRelativeKorean(userFolderCreateTime)}</span>
                    )}
                </div>
            </div>
            {showMoreButton && (
                <div className="UserFolderCardMoreContainer" ref={dropdownRef}>
                    <button
                        className="UserFolderCardMore"
                        onClick={handleMoreClick}
                        aria-label="더보기"
                        disabled={disabled}
                    >
                        ⋮
                    </button>
                    {showDropdown && (
                        <div className="UserFolderCardDropdown">
                            <button
                                className="UserFolderCardDropdownItem"
                                onClick={handleScrapClick}
                                disabled={disabled}
                            >
                                {disabled ? '스크랩 중...' : '폴더 스크랩하기'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserFolderCardHeader;
