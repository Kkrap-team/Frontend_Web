import React from 'react';
import '@/features/storage/styles/FolderHeader.css';

const url = import.meta.env.VITE_URL;

export default function FolderHeader({ data }) {
    return (
        <div className="FolderHeader">
            <div className="FolderCoverBlur" />
            <div className="FolderProfileSection">
                <img className="FolderProfileImage" src={`${url}${data.profile}`} alt="프로필" />
                <div className="FolderNickname">{data.nickname}</div>
                <div className="FolderBio">{data.bio}</div>

                <div className="FolderStats">
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{data.totalViewCount}+</span>
                        <span className="FolderStatLabel">Views</span>
                    </div>
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{(10000000 / 1000000).toFixed(0)}M</span>
                        <span className="FolderStatLabel">Scrap</span>
                    </div>
                    <div className="FolderStatItem">
                        <span className="FolderStatNum">{data.followingCount}</span>
                        <span className="FolderStatLabel">follower</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
