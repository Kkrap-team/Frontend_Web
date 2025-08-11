import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchRecommendedScroll, initRecommendedScroll } from '@/features/main/api/recommendApi';

export default function useRecommendedFeed(userId) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const isInitTriedRef = useRef(false);
    const inFlightRef = useRef(false);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);
    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    const loadMore = useCallback(async () => {
        if (!userId) return;
        if (loadingRef.current || inFlightRef.current || !hasMoreRef.current) return;

        setLoading(true);
        loadingRef.current = true;
        inFlightRef.current = true;
        setError(null);
        try {
            let { status, data } = await fetchRecommendedScroll(userId);
            if (status === 204 && !isInitTriedRef.current) {
                await initRecommendedScroll(userId);
                isInitTriedRef.current = true;
                ({ status, data } = await fetchRecommendedScroll(userId));
            }

            if (status === 200) {
                const batch = Array.isArray(data) ? data : data?.folders || [];
                if (batch.length === 0) {
                    setHasMore(false);
                    hasMoreRef.current = false;
                } else {
                    setItems((prev) => [...prev, ...batch]);
                }
            } else {
                setHasMore(false);
                hasMoreRef.current = false;
            }
        } catch (e) {
            setError(e);
        } finally {
            inFlightRef.current = false;
            setLoading(false);
            loadingRef.current = false;
        }
    }, [userId]);

    // 최초 로드 또는 사용자 변경 시 초기화
    useEffect(() => {
        setItems([]);
        setHasMore(true);
        hasMoreRef.current = true;
        setLoading(false);
        loadingRef.current = false;
        isInitTriedRef.current = false;
        if (userId) {
            // 초기 1회만 호출
            loadMore();
        }
    }, [userId]);

    return { items, loadMore, loading, hasMore, error };
}
