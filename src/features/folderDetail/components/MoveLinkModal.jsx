import React, { useMemo, useState } from 'react';
import '../styles/LinkSettingsModal.css';

export default function MoveLinkModal({ isOpen, onClose, folders = [], sourceFolderId, onSubmit, submitting }) {
    const ownFolders = useMemo(() => (Array.isArray(folders) ? folders : []), [folders]);
    const [target, setTarget] = useState('');

    if (!isOpen) return null;

    return (
        <div className="LinkSettingsModalOverlay" onClick={onClose}>
            <div className="LinkSettingsModal" onClick={(e) => e.stopPropagation()}>
                <div className="LinkSettingsModalHeader">
                    <h2>링크 이동</h2>
                </div>
                <div className="LinkSettingsModalContent">
                    <div className="LinkNameInputWrapper">
                        <select className="LinkNameInput" value={target} onChange={(e) => setTarget(e.target.value)}>
                            <option value="" disabled>
                                이동할 폴더를 선택하세요
                            </option>
                            {ownFolders.map((f) => (
                                <option
                                    key={f.folderId}
                                    value={f.folderId}
                                    disabled={Number(f.folderId) === Number(sourceFolderId)}
                                >
                                    {f.folderName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="LinkSettingsModalFooter">
                    <button className="LinkSettingsBtn CancelBtn" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="LinkSettingsBtn ConfirmBtn"
                        onClick={() => onSubmit && onSubmit(Number(target))}
                        disabled={!target || Number(target) === Number(sourceFolderId) || submitting}
                    >
                        {submitting ? '이동 중...' : '이동하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
