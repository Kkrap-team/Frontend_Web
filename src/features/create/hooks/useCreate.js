import { useState } from 'react';
import { createMyFolder, createLink } from '../api/createApi';

export default function useCreate(folders = [], userId, onSuccess) {
    // 모달 상태 관리
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    // 폴더 추가 함수
    const addFolder = async (data) => {
        try {
            console.log('data!@#!@#@!', data, userId, onSuccess);
            await createMyFolder(data, userId);
            setShowFolderModal(false);
            if (onSuccess) onSuccess(); // 생성 성공 시 콜백 실행
        } catch (err) {
            console.error('폴더 create 안됨 :', err);
        }
    };

    // 링크 추가 함수
    const addLink = async ({ link, folderId }) => {
        try {
            const linkData = {
                linkUrl: link,
                foldersId: Number(folderId),
            };

            await createLink(linkData, userId);
            setShowLinkModal(false);
            if (onSuccess) onSuccess(); // 생성 성공 시 콜백 실행
        } catch (err) {
            console.error('링크 create 안됨 :', err);
        }
    };

    // 모달 열기 함수들
    const openFolderModal = () => setShowFolderModal(true);
    const openLinkModal = () => setShowLinkModal(true);

    // 모달 닫기 함수들
    const closeFolderModal = () => setShowFolderModal(false);
    const closeLinkModal = () => setShowLinkModal(false);

    return {
        // API 함수들
        addFolder,
        addLink,

        // 모달 상태들
        showFolderModal,
        showLinkModal,

        // 모달 제어 함수들
        openFolderModal,
        openLinkModal,
        closeFolderModal,
        closeLinkModal,

        // 데이터
        folders,
    };
}
