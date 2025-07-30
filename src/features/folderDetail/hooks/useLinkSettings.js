import { useState } from 'react';
import { updateLinkTitle, deleteLink } from '../api/folderDetailApi';

export default function useLinkSettings(userId, folderInfo, refetch) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    //모달 열기 (케밥 버튼 클릭 시)
    const openModal = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    //모달 닫기
    const closeModal = () => {
        setShowModal(false);
        setSelectedLink(null);
    };

    //이름 수정
    const handleSave = async (updatedLink) => {
        try {
            await updateLinkTitle(userId, updatedLink.linkId, updatedLink.linkName);
            console.log('링크 제목 수정 성공:', updatedLink);
            closeModal();
            // 폴더 상세 정보 다시 불러오기
            if (refetch) {
                refetch();
            }
        } catch (error) {
            console.error('링크 제목 수정 실패:', error);
            alert('링크 제목 수정에 실패했습니다.');
        }
    };

    //링크 삭제
    const handleDelete = async (link) => {
        try {
            await deleteLink(
                userId,
                link.linkId,
                folderInfo.folderId,
                folderInfo.defaultFolder ? folderInfo.folderId : 0
            );
            console.log('링크 삭제 성공:', link);
            closeModal();
            // 폴더 상세 정보 다시 불러오기
            if (refetch) {
                refetch();
            }
        } catch (error) {
            console.error('링크 삭제 실패:', error);
            alert('링크 삭제에 실패했습니다.');
        }
    };

    return {
        showModal,
        selectedLink,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
    };
}
