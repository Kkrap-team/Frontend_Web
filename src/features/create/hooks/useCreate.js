import { useMemo, useState, useCallback } from 'react';
import { createMyFolder, createLink } from '../api/createApi';
import { getMyFolders } from '@/features/storage/api/myFolderApi';

export default function useCreate(initialFolders = [], userId, onSuccess) {
    // 모달 상태 관리
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [fetchedFolders, setFetchedFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(false);

    // 초기 폴더가 비어 있고 userId가 있으면 1회만 폴더 목록 로드
    const ensureFoldersLoaded = useCallback(async () => {
        if (!userId) return;
        if ((initialFolders && initialFolders.length > 0) || fetchedFolders.length > 0) return;
        if (loadingFolders) return;
        setLoadingFolders(true);
        try {
            const data = await getMyFolders(userId);
            const own = (data?.ownFolders || []).map((f) => ({ ...f, type: 'own' }));
            const shared = (data?.sharedFolders || []).map((f) => ({ ...f, type: 'shared' }));
            setFetchedFolders([...own, ...shared]);
        } catch (e) {
            console.error('폴더 목록 로딩 실패:', e);
        } finally {
            setLoadingFolders(false);
        }
    }, [userId, initialFolders, fetchedFolders.length, loadingFolders]);

    const folders = useMemo(() => {
        return initialFolders && initialFolders.length > 0 ? initialFolders : fetchedFolders;
    }, [initialFolders, fetchedFolders]);

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
    const openLinkModal = async () => {
        await ensureFoldersLoaded();
        setShowLinkModal(true);
    };

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
