import React, { useState } from 'react';
import FolderCreateModal from './FolderCreateModal';
import LinkAddModal from './LinkAddModal';
import '@/features/create/styles/CreateDropdown.css';
import useCreate from '@/features/create/hooks/useCreate';
import { useAuthStore } from '@/stores/authStore';

export default function CreateDropdown({ showFolderCreate = true, onSuccess }) {
    const [showMenu, setShowMenu] = useState(false);
    const { user } = useAuthStore();
    const userId = user?.userId;

    // 내부 훅에서 폴더 로딩/모달 상태/생성까지 모두 관리
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
        creatingFolder,
        creatingLink,
    } = useCreate(undefined, userId, onSuccess);

    return (
        <>
            <button className="CreateButton" onClick={() => setShowMenu((prev) => !prev)}>
                <img className="CreateButtonImg" src="/create_folder.png" alt="폴더 생성" />
            </button>
            {showMenu && (
                <div className="CreateDropdownMenu" onMouseLeave={() => setShowMenu(false)}>
                    {showFolderCreate && (
                        <button
                            onClick={() => {
                                openFolderModal();
                                setShowMenu(false);
                            }}
                        >
                            폴더 생성하기
                        </button>
                    )}
                    <button
                        onClick={() => {
                            openLinkModal();
                            setShowMenu(false);
                        }}
                    >
                        링크 추가하기
                    </button>
                </div>
            )}

            {/* 폴더 생성 모달 */}
            {showFolderModal && (
                <FolderCreateModal onClose={closeFolderModal} onSubmit={addFolder} folderSubmitting={creatingFolder} />
            )}

            {/* 링크 추가 모달 */}
            {showLinkModal && (
                <LinkAddModal
                    onClose={closeLinkModal}
                    onSubmit={addLink}
                    folders={folders}
                    linkSubmitting={creatingLink}
                />
            )}
        </>
    );
}
