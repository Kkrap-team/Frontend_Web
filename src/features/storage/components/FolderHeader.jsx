import React from 'react';
import '@/features/storage/styles/FolderHeader.css';
import { useFollow } from '@/features/follow/hooks/useFollow';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';

const url = import.meta.env.VITE_URL;

export default function FolderHeader({ data }) {
    const targetUserId = data?.userId;
    const { user } = useAuthStore();
    const myUserId = user?.userId;
    const { following, isLoading, toggleFollow, performUnfollow } = useFollow(targetUserId, data?.isFollowing);
    // 초기 팔로우 상태가 확정되기 전까지 로딩 처리
    const isReady = Boolean(targetUserId) && (typeof following === 'boolean' || typeof data?.isFollowing === 'boolean');
    const displayedFollowing = typeof following === 'boolean' ? following : Boolean(data?.isFollowing);
    const { showConfirm, showModal } = useModal();

    const handleFollowClick = () => {
        if (!targetUserId || isLoading || !isReady) return;
        if (following) {
            showConfirm({
                title: '언팔로우',
                message: '해당 사용자를 언팔로우 하시겠습니까?',
                confirmText: '언팔로우',
                cancelText: '취소',
                confirmType: 'delete',
                onConfirm: performUnfollow,
            });
        } else {
            showConfirm({
                title: '팔로우',
                message: '해당 사용자를 팔로우 하시겠습니까?',
                confirmText: '팔로우',
                cancelText: '취소',
                confirmType: 'save',
                onConfirm: toggleFollow,
            });
        }
    };

    return (
        <div className="FolderHeader">
            <div className="FolderCoverBlur" />

            <div className="FolderProfileSection">
                <div className="FolderTopBar">
                    <button
                        className="FolderSettingsBtn"
                        type="button"
                        onClick={() => showModal('accountSettings', { from: 'folderHeader' })}
                    >
                        <img className="UserSettingsIcon" src="/setting_icon.png" alt="settings" />
                    </button>
                </div>
                <img
                    className="FolderProfileImage"
                    src={
                        data?.profile
                            ? `${data.profile.startsWith('http') ? data.profile : `${url}${data.profile}`}?t=${Date.now()}`
                            : '/Kkrap_logo.png'
                    }
                    alt="프로필"
                />
                <div className="FolderNickname">{data.nickname}</div>
                <div className="FolderBio">{data.bio}</div>

                <div className="FolderStats">
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{data.totalViewCount}+</span>
                        <span className="FolderStatLabel">Views</span>
                    </div>
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{data.totalScrapCount}+</span>
                        <span className="FolderStatLabel">Scrap</span>
                    </div>
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{data.followingCount}+</span>
                        <span className="FolderStatLabel">follower</span>
                    </div>
                </div>
                <div className="FollowBtnContainer">
                    {targetUserId && targetUserId !== myUserId && (
                        <button className="FollowBtn" onClick={handleFollowClick} disabled={isLoading || !isReady}>
                            {!isReady || isLoading ? '로딩중...' : displayedFollowing ? '팔로우취소' : '팔로우'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
