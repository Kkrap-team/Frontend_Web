import React, { useState } from 'react';
import FolderCreateModal from './FolderCreateModal';
import LinkAddModal from './LinkAddModal';
import '@/features/create/styles/CreateDropdown.css';

export default function CreateDropdown({
    openFolderModal,
    openLinkModal,
    showFolderModal,
    showLinkModal,
    closeFolderModal,
    closeLinkModal,
    addFolder,
    addLink,
    folders,
    showFolderCreate = true, // 폴더 생성 메뉴 표시 여부
}) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <button className="CreateButton" onClick={() => setShowMenu((prev) => !prev)}>
                <img className="CreateButtonImg" src="/create_folder.png" alt="폴더 생성" />
            </button>
            {showMenu && (
                <div className="CreateDropdownMenu" onMouseLeave={() => setShowMenu(false)}>
                    {showFolderCreate && ( // 조건부로 폴더 생성 메뉴 표시
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
            {showFolderModal && <FolderCreateModal onClose={closeFolderModal} onSubmit={addFolder} />}

            {/* 링크 추가 모달 */}
            {showLinkModal && <LinkAddModal onClose={closeLinkModal} onSubmit={addLink} folders={folders} />}
        </>
    );
}
