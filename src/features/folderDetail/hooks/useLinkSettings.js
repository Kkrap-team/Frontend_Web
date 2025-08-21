import { useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useModal } from '@/contexts/ModalContext';
import { updateLinkTitle, deleteLink, moveLink } from '@/features/folderDetail/api/folderDetailApi';
import { getMyFolders } from '@/features/storage/api/myFolderApi';

export default function useLinkSettings(userId, refetch, isOwner) {
    const { showConfirm } = useModal();
    const [selectedLink, setSelectedLink] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [ownFolders, setOwnFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [moving, setMoving] = useState(false);
    const routeApi = getRouteApi('/folder/$folderId');
    const { folderId } = routeApi.useParams();

    const openModal = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLink(null);
    };

    const ensureOwnFolders = async () => {
        if (!isOwner || !userId) return;
        if (ownFolders.length > 0 || loadingFolders) return;
        setLoadingFolders(true);
        try {
            const data = await getMyFolders(userId);
            const own = (data?.ownFolders || []).map((f) => ({ folderId: f.folderId, folderName: f.folderName }));
            setOwnFolders(own);
        } catch (e) {
            console.error('내 폴더 목록 로딩 실패:', e);
        } finally {
            setLoadingFolders(false);
        }
    };

    const openMove = async () => {
        if (!isOwner) return;
        await ensureOwnFolders();
        setShowMoveModal(true);
    };

    const closeMove = () => {
        setShowMoveModal(false);
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
                    refetch();
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
                    const currentFolderId = Number(folderId || link.folderId);
                    await deleteLink(link.linkId, currentFolderId);
                    refetch();
                    closeModal();
                } catch (error) {
                    console.error('링크 삭제 실패:', error);
                    alert('링크 삭제에 실패했습니다.');
                }
            },
        });
    };

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

    const handleMove = (targetFolderId) => {
        if (!selectedLink) return;
        const srcId = Number(folderId || selectedLink.folderId);
        const dstId = Number(targetFolderId);
        if (srcId === dstId) return;

        const sourceName = ownFolders.find((f) => Number(f.folderId) === srcId)?.folderName || '현재 폴더';
        const targetName = ownFolders.find((f) => Number(f.folderId) === dstId)?.folderName || '선택한 폴더';

        showConfirm({
            title: '확인',
            message: `‘${sourceName}’\n폴더에서\n‘${targetName}’\n폴더로 링크를 이동하시겠습니까?`,
            confirmText: '이동',
            cancelText: '취소',
            confirmType: 'save',
            onConfirm: async () => {
                if (moving) return;
                setMoving(true);
                try {
                    await moveLink({ linkId: selectedLink.linkId, sourceFolderId: srcId, targetFolderId: dstId });
                    setShowMoveModal(false);
                    setShowModal(false);
                    refetch();
                } catch (error) {
                    console.error('링크 이동 실패:', error);
                    alert('링크 이동에 실패했습니다.');
                } finally {
                    setMoving(false);
                }
            },
        });
    };

    return {
        selectedLink,
        showModal,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        handleCopyLink,
        // move
        isOwner,
        showMoveModal,
        openMove,
        closeMove,
        ownFolders,
        loadingFolders,
        moving,
        handleMove,
    };
}
