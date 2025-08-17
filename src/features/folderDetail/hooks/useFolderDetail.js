import { useState, useEffect } from 'react';
import { getFolderDetail } from '../api/folderDetailApi';
import { useAuthStore } from '@/stores/authStore';

export default function useFolderDetail(folderId, targetUserId) {
    const [folderInfo, setFolderInfo] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthStore();
    const userId = user?.userId;

    // 폴더 상세 정보 및 링크 목록 조회
    const fetchFolderDetail = async () => {
        if (!folderId || !targetUserId) return;

        setLoading(true);
        setError(null);

        try {
            // 하나의 API로 폴더 정보와 링크 목록을 모두 가져옴

            const data = await getFolderDetail(folderId, targetUserId);


            // 폴더 정보 분리
            const { links: linksList, ...folderData } = data;

            setFolderInfo(folderData);
            setLinks(linksList || []);
        } catch (err) {
            console.error('폴더 상세 정보 조회 실패:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFolderDetail();
    }, [folderId, targetUserId]);

    return {
        folderInfo,
        links,
        loading,
        error,
        refetch: fetchFolderDetail,
    };
}
