import React from 'react';
import '@/features/storage/styles/FolderHeader.css';

const url = import.meta.env.VITE_URL;

export default function FolderHeader({ data }) {
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
            </div>
        </div>
    );
}
