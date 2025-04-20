// src/pages/LibraryPage/LibraryPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useMyFolders from '@/features/library/hooks/useMyFolder';
import MyFolderCard from '@/features/library/components/myFolder/MyFolderCard';
import FolderCreatePopup from '@/features/library/components/myFolder/FolderCreatePopup';
import './LibraryPage.css';

const LibraryPage = () => {
  const { user } = useAuth();
  const userId = user?.userId;

  const { folders, removeFolder, addFolder } = useMyFolders(userId);
  const [showPopup, setShowPopup] = useState(false);

  const handleCreate = async (data) => {
    await addFolder({ ...data, userId }); // userId를 생성 요청에 포함
    setShowPopup(false);
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h2 className="library-title">나만의 폴더</h2>
        <button className="create-button" onClick={() => setShowPopup(true)}>+ 폴더 생성</button>
      </div>

      <div className="folder-list">
        {folders.map((folder) => (
          <MyFolderCard key={folder.folderId} folder={folder} onDelete={removeFolder} />
        ))}
      </div>

      {showPopup && (
        <FolderCreatePopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default LibraryPage;
