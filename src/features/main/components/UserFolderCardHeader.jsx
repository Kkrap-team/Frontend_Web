import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { formatRelativeKorean } from '@/utils/formatRelativeTime';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';

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
    const { user } = useAuthStore();
    const { showConfirm } = useModal();

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
        // 자신의 폴더인지 확인
        if (folderData?.userId && user?.userId && folderData.userId === user.userId) {
            showConfirm({
                title: '스크랩 에러',
                message: '자신의 폴더는 스크랩할 수 없습니다.',
                confirmText: '확인',
                cancelText: null,
                onConfirm: () => {
                    setShowDropdown(false);
                }
            });
            return;
        }

        // 다른 사용자의 폴더인 경우 정상 스크랩 처리
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
