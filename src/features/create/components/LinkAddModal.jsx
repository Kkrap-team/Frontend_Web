import React, { useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import '@/features/create/styles/LinkAddModal.css';

export default function LinkAddModal({ onClose, onSubmit, folders = [], linkSubmitting = false }) {
    let folderId;
    try {
        const routeApi = getRouteApi('/folder/$folderId');
        folderId = routeApi.useParams().folderId;
    } catch (e) {
        folderId = null; // 스토리지 페이지에서는 null
    }
    const currentFolder = folders.find((folder) => folder.folderId === Number(folderId));
    const [link, setLink] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(currentFolder?.folderId || folders[0]?.folderId || '');

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setLink(text);
        } catch (e) {
            alert('클립보드에서 텍스트를 읽을 수 없습니다.');
        }
    };

    const handleLinkSubmit = () => {
        if (!link.trim()) {
            alert('링크 주소를 입력해주세요.');
            return;
        }
        if (linkSubmitting) return;
        onSubmit({ link, folderId: selectedFolder });
    };

    const handleLinkCancel = () => {
        onClose();
    };

    // 폴더를 타입별로 분류 (type 정보가 없으면 전체를 단일 리스트로 표시)
    const hasType = folders.some((f) => f && typeof f === 'object' && 'type' in f);
    const ownFolders = hasType ? folders.filter((folder) => folder.type === 'own') : folders;
    const sharedFolders = hasType ? folders.filter((folder) => folder.type === 'shared') : [];

    return (
        <div className="LinkAddModalBackdrop" onClick={handleLinkCancel}>
            <div className="LinkAddModal" onClick={(e) => e.stopPropagation()}>
                <button className="LinkAddModalClose" onClick={handleLinkCancel}>
                    &times;{/* $times는 X 버튼 */}
                </button>
                <h3 className="LinkAddModalTitle">링크 추가</h3>

                <div className="LinkAddModalField">
                    <label className="LinkAddModalLabel">저장할 위치</label>
                    <div className="LinkAddModalDropdown">
                        <select
                            className="LinkAddModalSelect"
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                        >
                            {ownFolders.length > 0 && (
                                <optgroup label="내 폴더">
                                    {ownFolders.map((folder) => (
                                        <option key={folder.folderId} value={folder.folderId}>
                                            {folder.folderName || '이름 없는 폴더'}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            {sharedFolders.length > 0 && (
                                <optgroup label="공유된 폴더">
                                    {sharedFolders.map((folder) => (
                                        <option key={folder.folderId} value={folder.folderId}>
                                            {folder.folderName || '이름 없는 폴더'}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                </div>

                <div className="LinkAddModalField">
                    <label className="LinkAddModalLabel">링크 주소</label>
                    <input
                        className="LinkAddModalInput"
                        type="text"
                        placeholder="링크 주소를 입력해주세요."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </div>

                <div className="LinkAddModalButtons">
                    <button className="LinkAddModalPaste" onClick={handlePaste} disabled={linkSubmitting}>
                        붙여넣기
                    </button>
                    <button className="LinkAddModalSubmit" onClick={handleLinkSubmit} disabled={linkSubmitting}>
                        {linkSubmitting ? '링크 추가 중...' : '추가하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
