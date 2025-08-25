import { useState, useEffect, useCallback } from 'react';
import { getFolderDetail, noAuthGetFolderDetail } from '../api/folderDetailApi';
import { useAuthStore } from '@/stores/authStore';

export default function useFolderDetail(folderId, targetUserId) {
    const [folderInfo, setFolderInfo] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    // 폴더 상세 정보 및 링크 목록 조회
    const fetchFolderDetail = useCallback(async () => {
        if (!folderId || !targetUserId) return;

        setLoading(true);
        setError(null);

        try {
            let data;
            
            // 로그인 상태에 따라 다른 API 호출
            if (isLoggedIn) {
                // 회원용 API
                data = await getFolderDetail(folderId, targetUserId);
            } else {
                // 비회원용 API
                data = await noAuthGetFolderDetail(folderId, targetUserId);
            }

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
    }, [folderId, targetUserId, isLoggedIn]);

    useEffect(() => {
        fetchFolderDetail();
    }, [fetchFolderDetail]);

    return {
        folderInfo,
        links,
        loading,
        error,
        refetch: fetchFolderDetail,
    };
}
