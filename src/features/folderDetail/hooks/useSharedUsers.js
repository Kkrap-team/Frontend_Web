// src/features/folderDetail/hooks/useSharedUsers.js
import { useEffect, useState, useCallback } from 'react';
import { getFolderPermissionList } from '@/features/storage/api/folderPermissionApi';

const pickSharedList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.invited)) return data.invited;
    if (Array.isArray(data?.granted)) return data.granted;
    if (Array.isArray(data?.allCandidates)) {
        return data.allCandidates.filter((u) => u.invited || u.granted || u.role);
    }
    return [];
};

export default function useSharedUsers(folderId) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        if (!folderId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getFolderPermissionList(folderId);
            const list = pickSharedList(data);
            const mapped = list.map((u) => ({
                userId: u.userId ?? u.followingId ?? u.id,
                nickname: u.nickname ?? u.name ?? '',
                profileImage: u.profile || u.profileImage || '',
                role: u.role ?? null,
            }));
            setUsers(mapped);
        } catch (e) {
            setError(e);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { users, loading, error, refetch };
}
