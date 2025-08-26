import React, { useState, useEffect } from 'react';
import '@/features/storage/styles/FolderHeader.css';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { checkFollowStatus, followUser, unfollowUser } from '@/features/follow/api/followApi';

const url = import.meta.env.VITE_URL;

export default function FolderHeader({ data }) {
    const targetUserId = data?.userId;
    const { user } = useAuthStore();
    const myUserId = user?.userId;
    
    // 팔로우 상태 관리
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    
    const { showConfirm, showModal } = useModal();

    // 팔로우 상태 확인 API 호출
    useEffect(() => {
        const checkFollowStatusAsync = async () => {
            if (!targetUserId || !myUserId || targetUserId === myUserId) {
                setIsReady(true);
                return;
            }

            try {
                setIsLoading(true);
                const response = await checkFollowStatus(targetUserId);
                setIsFollowing(response.mutual);
            } catch (error) {
                console.error('팔로우 상태 확인 오류:', error);
                setIsFollowing(false);
            } finally {
                setIsLoading(false);
                setIsReady(true);
            }
        };

        checkFollowStatusAsync();
    }, [targetUserId, myUserId]);

    // 팔로우/언팔로우 처리
    const handleFollowToggle = async () => {
        if (!targetUserId || isLoading) return;

        try {
            setIsLoading(true);
            
            if (isFollowing) {
                // 언팔로우
                await unfollowUser(targetUserId);
                setIsFollowing(false);
            } else {
                // 팔로우
                await followUser(targetUserId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('팔로우 처리 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollowClick = () => {
        if (!targetUserId || isLoading || !isReady) return;
        
        if (isFollowing) {
            showConfirm({
                title: '언팔로우',
                message: '해당 사용자를 언팔로우 하시겠습니까?',
                confirmText: '언팔로우',
                cancelText: '취소',
                confirmType: 'delete',
                onConfirm: handleFollowToggle,
            });
        } else {
            showConfirm({
                title: '팔로우',
                message: '해당 사용자를 팔로우 하시겠습니까?',
                confirmText: '팔로우',
                cancelText: '취소',
                confirmType: 'save',
                onConfirm: handleFollowToggle,
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
                            {!isReady || isLoading ? '로딩중...' : isFollowing ? '팔로우취소' : '팔로우'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
