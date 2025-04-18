// src/features/library/components/myFolder/MyFolderCard.jsx
import React from 'react';
import './MyFolderCard.css';

const MyFolderCard = ({ title, items }) => {
  return (
    <div className="folder-card">
      <div className="folder-header">
        <h3 className="folder-title">{title}</h3>
        <button className="more-btn">⋮</button>
      </div>
      <div className="folder-items">
        {items.map((item, idx) => (
          <div key={idx} className="folder-item">
            <img src={item.image} alt={item.title} className="folder-image" />
            <h4 className="item-title">{item.title}</h4>
            <p className="item-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFolderCard;
