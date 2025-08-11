import React, { useState, useRef, useEffect } from 'react';

const UserFolderCardHeader = ({
    displayName = '사용자',
    avatarSrc = '/Kkrap_logo.png',
    onMoreClick,
    showMoreButton = true,
    onScrap,
    folderData,
    disabled = false,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

    return (
        <div className="UserFolderCardHeader">
            <div className="UserFolderCardInfo">
                <img
                    className="UserFolderCardAvatar"
                    src={avatarSrc}
                    alt="user"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/Kkrap_logo.png';
                    }}
                />
                <span className="UserFolderCardName">{displayName}</span>
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
