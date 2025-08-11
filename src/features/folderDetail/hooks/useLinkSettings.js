import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { updateLinkTitle, deleteLink } from '@/features/folderDetail/api/folderDetailApi';

export default function useLinkSettings(userId, refetch) {
    const { showConfirm } = useModal();
    const [selectedLink, setSelectedLink] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLink(null);
    };

    const handleSave = (link, newName) => {
        showConfirm({
            title: '확인',
            message: '링크 이름을 수정하시겠습니까?',
            confirmText: '확인',
            cancelText: '취소',
            confirmType: 'save',
            onConfirm: async () => {
                try {
                    await updateLinkTitle(link.linkId, newName);
                    // Hook에서 상태 관리
                    refetch(); // 링크 목록 새로고침
                    closeModal();
                } catch (error) {
                    console.error('링크 수정 실패:', error);
                    alert('링크 수정에 실패했습니다.');
                }
            },
        });
    };

    const handleDelete = (link) => {
        showConfirm({
            title: '삭제 확인',
            message: '이 링크를 삭제하시겠습니까?',
            confirmText: '삭제',
            cancelText: '취소',
            confirmType: 'delete',
            onConfirm: async () => {
                try {
                    await deleteLink(link.linkId, link.folderId, link.defaultFolderId);
                    // Hook에서 상태 관리
                    refetch(); // 링크 목록 새로고침
                    closeModal();
                } catch (error) {
                    console.error('링크 삭제 실패:', error);
                    alert('링크 삭제에 실패했습니다.');
                }
            },
        });
    };

    // 링크 복사 함수
    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link.linkUrl);
        showConfirm({
            title: '복사 완료',
            message: '링크가 클립보드에 복사되었습니다.',
            confirmText: '확인',
            confirmType: 'save',
            onConfirm: () => {},
        });
        closeModal();
    };

    return {
        selectedLink,
        showModal,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        handleCopyLink,
    };
}
