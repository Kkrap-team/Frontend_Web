import React, { useState } from 'react';
import '@/features/create/styles/LinkAddModal.css';

export default function LinkAddModal({ onClose, onSubmit, folders = [] }) {
    const [link, setLink] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(folders[0]?.id || '');

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setLink(text);
        } catch (e) {
            alert('클립보드에서 텍스트를 읽을 수 없습니다.');
        }
    };

    const handleSubmit = () => {
        if (!link) return alert('링크 주소를 입력해주세요.');
        onSubmit({ link, folderId: selectedFolder });
        onClose();
    };

    return (
        <div className="LinkAddModalBackdrop">
            <div className="LinkAddModal">
                <button className="LinkAddModalClose" onClick={onClose}>
                    &times;
                </button>
                <h3 className="LinkAddModalTitle">업로드</h3>
                <input
                    className="LinkAddModalInput"
                    type="text"
                    placeholder="링크 주소를 입력해주세요."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <div className="LinkAddModalSelectWrapper">
                    <label htmlFor="folder-select">저장할 위치</label>
                    <select
                        id="folder-select"
                        className="LinkAddModalSelect"
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                    >
                        {folders.map((folder) => (
                            <option key={folder.folderId} value={folder.folderId}>
                                {folder.folderName || '이름 없는 폴더'}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="LinkAddModalButtons">
                    <button className="LinkAddModalPaste" onClick={handlePaste}>
                        붙여넣기
                    </button>
                    <button className="LinkAddModalSubmit" onClick={handleSubmit}>
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );
}
