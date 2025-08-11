import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchRecommendedScroll, initRecommendedScroll } from '@/features/main/api/recommendApi';

export default function useRecommendedFeed() {
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
        if (loadingRef.current || inFlightRef.current || !hasMoreRef.current) return;

        setLoading(true);
        loadingRef.current = true;
        inFlightRef.current = true;
        setError(null);
        try {
            let { status, data } = await fetchRecommendedScroll();
            if (status === 204 && !isInitTriedRef.current) {
                await initRecommendedScroll();
                isInitTriedRef.current = true;
                ({ status, data } = await fetchRecommendedScroll());
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
            console.error('추천 피드 로드 실패:', e);
            setError(e);
        } finally {
            inFlightRef.current = false;
            setLoading(false);
            loadingRef.current = false;
        }
    }, []);

    // 최초 로드 시 초기화
    useEffect(() => {
        const initializeFeed = async () => {
            setItems([]);
            setHasMore(true);
            hasMoreRef.current = true;
            setLoading(false);
            loadingRef.current = false;
            isInitTriedRef.current = false;
            // 초기 1회만 호출
            await loadMore();
        };

        initializeFeed();
    }, [loadMore]);

    return { items, loadMore, loading, hasMore, error };
}
