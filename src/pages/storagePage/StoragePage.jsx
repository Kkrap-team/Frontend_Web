// src/pages/storagePage/StoragePage.jsx
import React, { useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import useMyFolder from '@/features/storage/hooks/useMyFolder';
import useCreate from '@/features/create/hooks/useCreate';
import FolderHeader from '@/features/storage/components/FolderHeader';
import FolderList from '@/features/storage/components/MyFolderList';
import CreateDropdown from '@/features/create/components/CreateDropdown';
import FolderCreateModal from '@/features/create/components/FolderCreateModal';
import PermissionModal from '@/features/storage/components/PermissionModal';
import usePermissionUsers from '@/features/storage/hooks/usePermissionUsers';

const routeApi = getRouteApi('/storage/$userId');

export default function StoragePage() {
    const { userId: routeUserId } = routeApi.useParams();
    const { user } = useAuthStore();
    const currentUserId = user?.userId;

    // URL의 userId와 현재 로그인한 사용자의 userId가 다르면 다른 사람의 보관함
    const isOwnStorage = routeUserId === currentUserId?.toString();
    const targetUserId = routeUserId || currentUserId;

    const {
        ownFolders = [],
        sharedFolders = [],
        removeFolder,
        fetchFolders,
        myFolderProfile,
        editFolder,
    } = useMyFolder(targetUserId) || {};

    // 모든 폴더를 하나의 배열로 합치기
    const allFolders = [
        ...ownFolders.map((folder) => ({ ...folder, type: 'own' })),
        ...sharedFolders.map((folder) => ({ ...folder, type: 'shared' })),
    ];

    // useCreate 훅 사용 (모든 로직 포함)
    const {
        addFolder,
        addLink,
        showFolderModal,
        showLinkModal,
        openFolderModal,
        openLinkModal,
        closeFolderModal,
        closeLinkModal,
        folders,
    } = useCreate(allFolders, targetUserId, fetchFolders);

    const {
        users: followingUsers,
        invitedUsers,
        notInvitedUsers,
        owner,
        loading: usersLoading,
        error: usersError,
        showPermissionModal,
        selectedUsers,
        openPermissionModal,
        closePermissionModal,
        handleUserSelect,
        handlePermissionConfirm,
        handlePermissionRevoke,
    } = usePermissionUsers(targetUserId, fetchFolders);

    const [modalMode, setModalMode] = useState(null);
    const [editTargetFolder, setEditTargetFolder] = useState(null);

    // 폴더 수정 버튼 클릭 (MyFolderCard에서 호출)
    const handleEditClick = (folder) => {
        setModalMode('edit');
        setEditTargetFolder(folder);
        // 폴더 수정 모달은 별도로 관리
    };

    //폴더 수정 함수
    const handleEdit = async (data) => {
        await editFolder(
            { ...data, folderId: editTargetFolder.folderId }, // 폴더 id와 수정 데이터 합쳐서 전달
            fetchFolders
        );
        setModalMode(null);
        setEditTargetFolder(null);
    };

    //폴더 삭제 함수
    const handleDelete = async (folder) => {
        await removeFolder(folder);
    };

    //제목 표시 이름
    const displayName = isOwnStorage ? user.nickname : myFolderProfile?.nickname ?? '사용자';

    return (
        <div className="StorageContainer" style={{ paddingBottom: '120px' }}>
            <FolderHeader data={myFolderProfile} />
            <div className="StorageHeader">
                <h2 className="StorageTitle">{`${displayName}님의 폴더`}</h2>
                {isOwnStorage && (
                    <CreateDropdown
                        openFolderModal={openFolderModal}
                        openLinkModal={openLinkModal}
                        showFolderModal={showFolderModal}
                        showLinkModal={showLinkModal}
                        closeFolderModal={closeFolderModal}
                        closeLinkModal={closeLinkModal}
                        addFolder={addFolder}
                        addLink={addLink}
                        folders={folders}
                        showFolderCreate={true}
                    />
                )}
            </div>
            <FolderList
                folders={ownFolders}
                onDelete={isOwnStorage ? handleDelete : undefined}
                onEdit={isOwnStorage ? handleEditClick : undefined}
                onPermission={isOwnStorage ? openPermissionModal : undefined}
                defaultFolderId={ownFolders[0]?.folderId}
                allFolders={allFolders}
                showMenu={isOwnStorage}
                showLockIcon={isOwnStorage}
            />
            {isOwnStorage && (
                <>
                    <div className="StorageHeader">
                        <br />
                        <h2 className="StorageTitle">{displayName}님과 공유된 폴더</h2>
                        <FolderList
                            folders={sharedFolders}
                            onDelete={handleDelete}
                            onEdit={handleEditClick}
                            onPermission={openPermissionModal}
                            defaultFolderId={ownFolders[0]?.folderId}
                            allFolders={allFolders}
                            showLockIcon={isOwnStorage}
                        />
                    </div>
                </>
            )}

            {/* 폴더 수정 모달 */}
            {modalMode === 'edit' && editTargetFolder && (
                <FolderCreateModal
                    mode={modalMode}
                    initialData={editTargetFolder}
                    onClose={() => {
                        setModalMode(null);
                        setEditTargetFolder(null);
                    }}
                    onSubmit={handleEdit}
                />
            )}

            {showPermissionModal && (
                <PermissionModal
                    isOpen={showPermissionModal}
                    users={followingUsers}
                    invitedUsers={invitedUsers}
                    notInvitedUsers={notInvitedUsers}
                    owner={owner}
                    selectedUsers={selectedUsers}
                    onUserSelect={handleUserSelect}
                    onClose={closePermissionModal}
                    onConfirm={handlePermissionConfirm}
                    onRevoke={handlePermissionRevoke}
                    loading={usersLoading}
                    error={usersError}
                />
            )}
        </div>
    );
}
