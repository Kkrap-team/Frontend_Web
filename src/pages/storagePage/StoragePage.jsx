// src/pages/storagePage/StoragePage.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import useMyFolder from '@/features/storage/hooks/useMyFolder';
import useCreate from '@/features/create/hooks/useCreate';
import FolderHeader from '@/features/storage/components/FolderHeader';
import FolderList from '@/features/storage/components/MyFolderList';
import CreateDropdown from '@/features/create/components/CreateDropdown';
import FolderCreateModal from '@/features/create/components/FolderCreateModal';
import LinkAddModal from '@/features/create/components/LinkAddModal';

export default function StoragePage() {
    const { user } = useAuth();
    const userId = user?.userId;
    const { ownFolders = [], sharedFolders = [], removeFolder } = useMyFolder(userId) || {};
    const { addFolder } = useCreate();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    const handleCreate = async (data) => {
        await addFolder({ ...data, userId });
    };

    const handleDelete = async (folder, userId) => {
        await removeFolder(folder, userId);
    };
    // 링크 추가 함수
    const handleAddLink = async ({ link, folderId }) => {
        // 실제로 링크를 폴더에 추가하는 로직 작성
        console.log('추가할 링크:', link, '폴더ID:', folderId);
        setShowLinkModal(false);
    };

    return (
        <div className="StorageContainer">
            <FolderHeader />
            <div className="StorageHeader">
                <h2 className="StorageTitle">{user.nickname}님의 폴더</h2>
                <CreateDropdown
                    onCreateFolder={() => setShowCreateModal(true)}
                    onAddLink={() => setShowLinkModal(true)}
                />
            </div>
            <FolderList folders={ownFolders} onDelete={handleDelete} />
            <div className="StorageHeader">
                <h2 className="StorageTitle">{user.nickname}님과 공유된 폴더</h2>
                <FolderList folders={sharedFolders} />
            </div>
            {showCreateModal && (
                <FolderCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={async (data) => {
                        await handleCreate(data);
                        setShowCreateModal(false);
                    }}
                />
            )}
            {showLinkModal && (
                <LinkAddModal onClose={() => setShowLinkModal(false)} onSubmit={handleAddLink} folders={ownFolders} />
            )}
        </div>
    );
}
