import { useCallback, useEffect, useState, useRef } from 'react';
import { fetchNoAuthMainFolders } from '@/features/main/api/recommendApi';

export default function useNoAuthMainFeed(enabled = true) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasLoadedRef = useRef(false);

    const loadFolders = useCallback(async () => {
        if (!enabled) return;
        if (loading || hasLoadedRef.current) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchNoAuthMainFolders();
            const folders = Array.isArray(data) ? data : data?.folders || [];
            setItems(folders);
            hasLoadedRef.current = true; // 한 번 로드되면 더 이상 호출하지 않음
        } catch (e) {
            console.error('비회원 메인 폴더 로드 실패:', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [enabled, loading]);

    // 최초 로드 시 폴더 조회 (한 번만)
    useEffect(() => {
        if (!enabled) return;
        if (!hasLoadedRef.current) {
            loadFolders();
        }
    }, [enabled, loadFolders]);

    return {
        items,
        loading,
        error,
        refresh: loadFolders,
    };
}
