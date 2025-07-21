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
    const {
        ownFolders = [],
        sharedFolders = [],
        removeFolder,
        fetchFolders,
        myFolderProfile,
        editFolder,
    } = useMyFolder(userId) || {};
    const { addFolder, addLink } = useCreate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [editTargetFolder, setEditTargetFolder] = useState(null);

    // 폴더 생성 버튼 클릭
    const handleCreateClick = () => {
        setModalMode('create');
        setEditTargetFolder(null);
        setShowCreateModal(true);
    };

    // 폴더 생성/수정 모달 닫기
    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditTargetFolder(null);
        setModalMode(null);
    };

    // 폴더 수정 버튼 클릭 (MyFolderCard에서 호출)
    const handleEditClick = (folder) => {
        setModalMode('edit');
        setEditTargetFolder(folder);
        setShowCreateModal(true);
    };

    //폴더 생성/수정 모달 제출 함수
    const handleSubmit = async (data) => {
        if (modalMode === 'create') {
            await handleCreate(data);
        } else if (modalMode === 'edit') {
            await handleEdit(data);
        }
        setShowCreateModal(false);
        setEditTargetFolder(null);
        setModalMode(null);
    };

    //폴더 생성 함수
    const handleCreate = async (data) => {
        await addFolder(data, userId, fetchFolders);
    };

    //폴더 수정 함수
    const handleEdit = async (data) => {
        if (!editTargetFolder) {
            alert('수정할 폴더 정보가 없습니다.');
            return;
        }
        await editFolder(
            { ...data, folderId: editTargetFolder.folderId, userId }, // 폴더 id와 수정 데이터 합쳐서 전달
            fetchFolders
        );
    };

    //폴더 삭제 함수
    const handleDelete = async (folder, userId) => {
        await removeFolder(folder, userId);
    };

    // 링크 추가 함수
    const handleAddLink = async ({ link, folderId }) => {
        await addLink(
            {
                linkUrl: link,
                foldersId: Number(folderId),
                defaultFoldersId: Number(ownFolders[0].folderId),
            },
            userId,
            fetchFolders
        );
        console.log('링크 추가 함수 실행', link, folderId, ownFolders[0].folderId, userId);
        setShowLinkModal(false);
    };

    return (
        <div className="StorageContainer">
            <FolderHeader data={myFolderProfile} />
            <div className="StorageHeader">
                <h2 className="StorageTitle">{user.nickname}님의 폴더</h2>
                <CreateDropdown onCreateFolder={handleCreateClick} onAddLink={() => setShowLinkModal(true)} />
            </div>
            <FolderList folders={ownFolders} onDelete={handleDelete} onEdit={handleEditClick} />
            <div className="StorageHeader">
                <br />
                <h2 className="StorageTitle">{user.nickname}님과 공유된 폴더</h2>
                <FolderList folders={sharedFolders} />
            </div>
            {showCreateModal && (
                <FolderCreateModal
                    mode={modalMode}
                    initialData={editTargetFolder}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                />
            )}
            {showLinkModal && (
                <LinkAddModal onClose={() => setShowLinkModal(false)} onSubmit={handleAddLink} folders={ownFolders} />
            )}
        </div>
    );
}
