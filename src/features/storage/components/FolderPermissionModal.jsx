import React from 'react';
import '@/features/storage/styles/FolderPermissionModal.css';

const FolderPermissionModal = ({ isOpen, users, selectedUsers, onUserSelect, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* 상단 타이틀 */}
                {/* 검색창 */}
                {/* 유저 리스트 (아바타, 이름, 이메일, 체크박스) */}
                {/* 하단 취소/확인 버튼 */}
            </div>
        </div>
    );
};

export default FolderPermissionModal;
