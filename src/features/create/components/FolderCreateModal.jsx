import React, { useState } from 'react';
import '@/features/create/styles/FolderCreateModal.css';

export default function FolderCreateModal({ mode, initialData, onClose, onSubmit, folderSubmitting = false }) {
    const [folderName, setFolderName] = useState(initialData?.folderName || '');
    const [folderDescription, setFolderDescription] = useState(initialData?.folderDescription || '');
    const [visible, setVisible] = useState(initialData?.visible ?? true);

    const MAX_NAME = 20;
    const MAX_DESC = 30;

    const handleFolderSubmit = () => {
        if (!folderName.trim()) {
            alert('폴더 제목을 입력해주세요.');
            return;
        }
        if (folderSubmitting) return;
        onSubmit({ folderName, folderDescription, visible });
    };

    const handleFolderCancel = () => {
        onClose();
    };

    return (
        <div className="FolderCreateModalBackdrop" onClick={handleFolderCancel}>
            <div className="FolderCreateModal" onClick={(e) => e.stopPropagation()}>
                <h3 className="FolderCreateModalTitle">{mode === 'edit' ? '폴더 수정' : '폴더 생성'}</h3>

                <div className="FolderCreateModalField">
                    <label className="FolderCreateModalLabel">
                        폴더 제목 <span className="required">*</span>
                    </label>
                    <div className="CreateInputWithCounter">
                        <input
                            type="text"
                            className="FolderCreateModalInput"
                            placeholder="폴더 제목을 입력하세요"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            maxLength={MAX_NAME}
                        />
                        <span className="CreateInputCounter">
                            {folderName.length} / {MAX_NAME}
                        </span>
                    </div>
                </div>

                <div className="FolderCreateModalField">
                    <label className="FolderCreateModalLabel">폴더 설명</label>
                    <div className="CreateInputWithCounter">
                        <input
                            type="text"
                            className="FolderCreateModalInput"
                            placeholder="폴더 설명을 입력하세요"
                            value={folderDescription}
                            onChange={(e) => setFolderDescription(e.target.value)}
                            maxLength={MAX_DESC}
                        />
                        <span className="CreateInputCounter">
                            {folderDescription.length} / {MAX_DESC}
                        </span>
                    </div>
                </div>

                <div className="FolderCreateModalField">
                    <label className="FolderCreateModalLabel">공개 설정</label>
                    <div className="FolderCreateModalDropdown">
                        <select
                            value={visible ? 'public' : 'private'}
                            onChange={(e) => setVisible(e.target.value === 'public')}
                            className="FolderCreateModalSelect"
                        >
                            <option value="public">공개</option>
                            <option value="private">비공개</option>
                        </select>
                    </div>
                </div>

                <div className="FolderCreateModalButtons">
                    <button className="FolderCreateModalCancelBtn" onClick={handleFolderCancel}>
                        취소
                    </button>
                    <button
                        className="FolderCreateModalConfirmBtn"
                        onClick={handleFolderSubmit}
                        disabled={folderSubmitting}
                    >
                        {folderSubmitting ? '폴더 생성 중...' : mode === 'edit' ? '수정' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
}
