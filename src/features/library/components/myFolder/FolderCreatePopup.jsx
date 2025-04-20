import React, { useState } from 'react';
import './FolderCreatePopup.css';

const FolderCreatePopup = ({ onClose, onSubmit }) => {
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    onSubmit({ folderName, folderDescription, visible });
    onClose();
  };

  return (
    <div className="popup-backdrop">
      <div className="popup">
        <h3>폴더 생성</h3>
        <input
          type="text"
          placeholder="폴더 이름"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <textarea
          placeholder="폴더 설명"
          value={folderDescription}
          onChange={(e) => setFolderDescription(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={visible}
            onChange={() => setVisible(!visible)}
          />
            공개/비공개
        </label>
        <div className="popup-buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default FolderCreatePopup;
