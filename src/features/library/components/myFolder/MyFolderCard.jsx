import React, { useState } from 'react';
import './MyFolderCard.css';

const MyFolderCard = ({ folder, onDelete }) => {
  const { folderName, links, folderId } = folder;
  const [showMenu, setShowMenu] = useState(false);

  const recentLinks = [...links]
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    .slice(0, 2);

  return (
    <div className="folder-card">
      <div className="folder-header">
        <h3 className="folder-title">{folderName}</h3>
        <div className="more-wrapper">
          <button
            className="more-btn"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            ⋮
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => onDelete(folderId)}>폴더 삭제</button>
            </div>
          )}
        </div>
      </div>

      <div className="folder-items">
        {recentLinks.map((link) => (
          <div key={link.linkId} className="folder-item">
            <img
              className="folder-image"
              src={`https://image.thum.io/get/width/300/crop/600/${link.linkUrl}`}
              alt={link.linkName}
            />
            <h4 className="item-title">{link.linkName}</h4>
            <p className="item-subtitle">{link.linkDescription || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFolderCard;
