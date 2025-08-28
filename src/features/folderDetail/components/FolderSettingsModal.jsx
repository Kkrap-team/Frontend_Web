import React from 'react';
import '@/features/profile/styles/AccountSettingsModal.css';

export default function FolderSettingsModal({ onClose, onEdit, onPermission, onDelete }) {
    return (
        <div className="AccountSettingsOverlay" onClick={onClose}>
            <div className="AccountSettingsModal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="AccountSettingsTitle">폴더 설정</div>
                <ul className="AccountSettingsList">
                    <li>
                        <button type="button" onClick={onEdit}>
                            폴더 수정하기
                        </button>
                    </li>
                    <li>
                        <button type="button" className="FolderDetailPermissionBtn" onClick={onPermission}>
                            폴더 권한제어
                        </button>
                    </li>
                    <li>
                        <button type="button" className="danger" onClick={onDelete}>
                            삭제하기
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
