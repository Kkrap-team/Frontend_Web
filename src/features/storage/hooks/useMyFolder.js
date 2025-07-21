import { useEffect, useState, useCallback } from 'react';
import { getMyFolders, deleteMyFolder, getMyFolderProfile, editMyFolder } from '../api/myFolderApi';

export default function useMyFolders(userId) {
    const [ownFolders, setOwnFolders] = useState([]);
    const [sharedFolders, setSharedFolders] = useState([]);
    const [myFolderProfile, setMyFolderProfile] = useState([]);

    //폴더 헤더 조회
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

    //폴더 조회(내 폴더, 공유 폴더)
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
            alert('모든 링크 폴더는 삭제할 수 없습니다.');
            return;
        }
        try {
            await deleteMyFolder(userId, folder.folderId);
            fetchFolders();
        } catch (err) {
            console.error('폴더 delete 안됨 :', err);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    return { ownFolders, sharedFolders, removeFolder, fetchFolders, myFolderProfile, editFolder };
}
