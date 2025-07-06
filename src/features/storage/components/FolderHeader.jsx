import React from 'react';
import '@/features/storage/styles/FolderHeader.css';

const mockHeaderData = {
  profileImage: '/Kkrap_logo.png',
  nickname: 'Piggg',
  description: '나는 돼지당 ㅎ',
  views: 100,
  scrap: 10000000,
  follower: 5000000,
};

export default function FolderHeader({ data = mockHeaderData }) {
  return (
    <div className="FolderHeader">
      <div className="FolderCoverBlur" />
      <div className="FolderProfileSection">
        <img className="FolderProfileImage" src={data.profileImage} alt="프로필" />
        <div className="FolderNickname">{data.nickname}</div>
        <div className="FolderDescription">{data.description}</div>
        <div className="FolderStats">
          <div><span className="FolderStatNum">{data.views}+</span><br/> <span className="FolderStatLabel">Views</span></div>
          <div><span className="FolderStatNum">{(data.scrap/1000000).toFixed(0)}M</span><br/> <span className="FolderStatLabel">Scrap</span></div>
          <div><span className="FolderStatNum">{(data.follower/1000000).toFixed(0)}M</span><br/> <span className="FolderStatLabel">follower</span></div>
        </div>
      </div>
    </div>
  );
}
