// src/pages/LibraryPage/LibraryPage.jsx
import React from 'react';
import useMyFolders from '@/features/library/hooks/useMyFolder';
import {useAuth} from '../../contexts/AuthContext';
import './LibraryPage.css';

const LibraryPage = () => {
  
  const {user} = useAuth();
  const userId = user?.userId;
  const { folders} = useMyFolders(userId);

  return (
    <div className="library-container">
      <div className="library-header">
        <h2 className="library-title">나만의 폴더</h2>
        <ul className='folder-list'>
        {folders.map((folder) => (
          <li key={folder.folderId}>{folder.folderName}</li>
        ))}
        </ul>
      </div>

    </div>
  );
};

export default LibraryPage;
