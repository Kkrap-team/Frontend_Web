import React, { useState } from 'react';
import '@/features/create/styles/FolderCreateModal.css';

export default function FolderCreateModal({ mode, initialData, onClose, onSubmit }) {
    const [folderName, setFolderName] = useState(initialData?.folderName || '');
    const [folderDescription, setFolderDescription] = useState(initialData?.folderDescription || '');
    const [visible, setVisible] = useState(initialData?.visible ?? true);

    const handleFolderSubmit = () => {
        onSubmit({ folderName, folderDescription, visible });
    };

    const handleFolderCancel = () => {
        onClose();
    };

    return (
        <div className="PopupBackdrop">
            <div className="Popup">
                <h3>{mode === 'edit' ? '폴더 수정' : '폴더 생성'}</h3>
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
                    <input type="checkbox" checked={visible} onChange={() => setVisible(!visible)} />
                    공개/비공개
                </label>
                <div className="PopupButtons">
                    <button onClick={handleFolderCancel}>취소</button>
                    <button onClick={handleFolderSubmit}>{mode === 'edit' ? '수정하기' : '생성하기'}</button>
                </div>
            </div>
        </div>
    );
}
