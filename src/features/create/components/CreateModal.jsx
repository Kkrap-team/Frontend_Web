import React, { useEffect, useState } from 'react';
import FolderCreateModal from './FolderCreateModal';
import LinkAddModal from './LinkAddModal';
import '@/features/create/styles/CreateModal.css';
import useCreate from '@/features/create/hooks/useCreate';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { useNavigate } from '@tanstack/react-router';

export default function CreateModal({ showFolderCreate = true, onSuccess }) {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuthStore();
    const userId = user?.userId;
    const { showConfirm } = useModal();
    const navigate = useNavigate();

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

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        if (showModal) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showModal]);

    return (
        <>
            <button
                className="CreateButton"
                onClick={() => {
                    if (!user) {
                        showConfirm({
                            title: '로그인 필요',
                            message: '폴더 및 링크 생성은 로그인이 필요합니다. \n 로그인하시겠습니까?',
                            confirmText: '로그인',
                            cancelText: '취소',
                            onConfirm: () => navigate({ to: '/login' }),
                        });
                        return;
                    }
                    setShowModal(true);
                }}
            >
                <img className="CreateButtonImg" src="/create_icon.png" alt="새 콘텐츠 추가" />
            </button>

            {showModal && (
                <div className="CreateModalOverlay" onClick={() => setShowModal(false)}>
                    <div className="CreateModal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="CreateModalHeader">
                            <button className="CreateModalClose" aria-label="닫기" onClick={() => setShowModal(false)}>
                                ×
                            </button>
                            <h3 className="CreateModalTitle">새 콘텐츠 추가</h3>
                        </div>
                        <div className={`CreateOptions ${!showFolderCreate ? 'CreateOptionsSingle' : ''}`}>
                            {showFolderCreate && (
                                <button
                                    className="CreateOption"
                                    onClick={() => {
                                        if (!user) {
                                            showConfirm({
                                                title: '로그인 필요',
                                                message:
                                                    '폴더 및 링크 생성은 로그인이 필요합니다. \n 로그인하시겠습니까?',
                                                confirmText: '로그인',
                                                cancelText: '취소',
                                                onConfirm: () => navigate({ to: '/login' }),
                                            });
                                            return;
                                        }
                                        openFolderModal();
                                        setShowModal(false);
                                    }}
                                >
                                    <span className="CreateOptionIcon">
                                        <img src="/folder_create_icon.png" alt="폴더 생성" />
                                    </span>
                                    <span className="CreateOptionLabel">폴더 생성</span>
                                </button>
                            )}
                            <button
                                className="CreateOption"
                                onClick={() => {
                                    if (!user) {
                                        showConfirm({
                                            title: '로그인 필요',
                                            message: '폴더 및 링크 생성은 로그인이 필요합니다. \n 로그인하시겠습니까?',
                                            confirmText: '로그인',
                                            cancelText: '취소',
                                            onConfirm: () => navigate({ to: '/login' }),
                                        });
                                        return;
                                    }
                                    openLinkModal();
                                    setShowModal(false);
                                }}
                            >
                                <span className="CreateOptionIcon">
                                    <img src="/link_create_icon.png" alt="링크 추가" />
                                </span>
                                <span className="CreateOptionLabel">링크 추가</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFolderModal && (
                <FolderCreateModal onClose={closeFolderModal} onSubmit={addFolder} folderSubmitting={creatingFolder} />
            )}

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
