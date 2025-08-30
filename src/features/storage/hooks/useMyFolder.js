import { useEffect, useState, useCallback } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { getMyFolders, deleteMyFolder, getMyFolderProfile, editMyFolder } from '../api/myFolderApi';

export default function useMyFolders(userId) {
    const { showConfirm } = useModal();
    const [ownFolders, setOwnFolders] = useState([]);
    const [sharedFolders, setSharedFolders] = useState([]);
    const [myFolderProfile, setMyFolderProfile] = useState([]);

    //폴더 헤더 조회 - 비회원일 때는 호출하지 않음
    useEffect(() => {
        if (!userId) return;
        const fetchProfile = async () => {
            try {
                const data = await getMyFolderProfile(userId);
                setMyFolderProfile(data);
            } catch (err) {
                console.error('폴더 헤더 get 안됨 :', err);
            }
        };
        fetchProfile();
    }, [userId]);

    //폴더 조회(내 폴더, 공유 폴더) - 비회원일 때는 호출하지 않음
    const fetchFolders = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await getMyFolders(userId);
            setOwnFolders(data.ownFolders || []);
            setSharedFolders(data.sharedFolders || []);
        } catch (err) {
            console.error('폴더 get 안됨 :', err);
        }
    }, [userId]);

    //폴더 수정
    const editFolder = useCallback(
        async (data) => {
            try {
                await editMyFolder(data);
                fetchFolders();
            } catch (err) {
                console.error('폴더 edit 안됨 :', err);
            }
        },
        [fetchFolders]
    );

    // 폴더 삭제
    const removeFolder = async (folder) => {
        if (folder.defaultFolder) {
            showConfirm({
                title: '삭제 불가',
                message: '모든 링크 폴더는 삭제할 수 없습니다.',
                confirmText: '확인',
                confirmType: 'save',
                onConfirm: () => {},
            });
            return;
        }

        showConfirm({
            title: '폴더 삭제 확인',
            message: '정말로 이 폴더를 삭제하시겠습니까?',
            confirmText: '삭제',
            cancelText: '취소',
            confirmType: 'delete',
            onConfirm: async () => {
                try {
                    await deleteMyFolder(folder.folderId);
                    fetchFolders();
                } catch (err) {
                    console.error('폴더 delete 안됨 :', err);
                    showConfirm({
                        title: '삭제 실패',
                        message: '폴더 삭제에 실패했습니다. \n소유자만 삭제할 수 있습니다.',
                        confirmText: '확인',
                        confirmType: 'save',
                        onConfirm: () => {},
                    });
                }
            },
        });
    };

    useEffect(() => {
        // 비회원일 때는 API 호출하지 않음
        if (!userId) return;
        fetchFolders();
    }, [fetchFolders, userId]);

    return { ownFolders, sharedFolders, removeFolder, fetchFolders, myFolderProfile, editFolder };
}
