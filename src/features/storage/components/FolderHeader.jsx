import React from 'react';
import '@/features/storage/styles/FolderHeader.css';
import { useFollow } from '@/features/follow/hooks/useFollow';
import { useAuthStore } from '@/stores/authStore';

const url = import.meta.env.VITE_URL;

export default function FolderHeader({ data }) {
    const targetUserId = data?.userId;
    const { user } = useAuthStore();
    const myUserId = user?.userId;
    const { following, isLoading, toggleFollow, performUnfollow } = useFollow(targetUserId, data?.isFollowing);

    const handleFollowClick = () => {
        if (!targetUserId || isLoading) return <div>타겟유저 아이디가 없음</div>;
        if (following) performUnfollow();
        else toggleFollow();
    };

    return (
        <div className="FolderHeader">
            <div className="FolderCoverBlur" />
            <div className="FolderProfileSection">
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
                        <button className="FollowBtn" onClick={handleFollowClick} disabled={isLoading}>
                            {following ? '팔로우취소' : '팔로우'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
