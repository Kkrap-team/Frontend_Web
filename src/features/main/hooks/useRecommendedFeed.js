import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchRecommendedScroll, initRecommendedScroll, scrapFolder } from '@/features/main/api/recommendApi';

export default function useRecommendedFeed(enabled = true) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [scrapLoading, setScrapLoading] = useState(false);

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
        if (!enabled) return;
        if (loadingRef.current || inFlightRef.current || !hasMoreRef.current) return;

        setLoading(true);
        loadingRef.current = true;
        inFlightRef.current = true;
        setError(null);
        try {
            let { status, data } = await fetchRecommendedScroll();
            if (status === 204 && !isInitTriedRef.current) {
                // init이 실제 데이터를 반환할 수 있으므로 우선 사용
                const initData = await initRecommendedScroll();
                isInitTriedRef.current = true;
                const initBatch = Array.isArray(initData) ? initData : initData?.folders || [];
                if (initBatch.length > 0) {
                    setItems((prev) => [...prev, ...initBatch]);

                    return;
                }
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
    }, [enabled]);

    // hasMore가 false여도 한 번 더 시도할 수 있게 강제 재시도 함수
    const retryLoad = useCallback(async () => {
        if (!enabled) return;
        if (loadingRef.current || inFlightRef.current) return;
        setHasMore(true);
        hasMoreRef.current = true;
        await loadMore();
    }, [enabled, loadMore]);

    // 폴더 스크랩 처리
    const handleScrapFolder = useCallback(
        async (folderData) => {
            if (scrapLoading) return; // 중복 요청 방지

            setScrapLoading(true);
            setError(null);

            try {
                const scrapData = {
                    sourceFolderId: folderData.folderId,
                    folderName: folderData.folderName,
                    folderDescription: folderData.folderDescription,
                    visible: folderData.visible,
                };

            
                await scrapFolder(scrapData);

                return { success: true };
            } catch (error) {
                console.error('스크랩 실패:', error);
                setError(error);
                return { success: false };
            } finally {
                setScrapLoading(false);
            }
        },
        [scrapLoading]
    );

    // 최초 로드 시 초기화
    useEffect(() => {
        if (!enabled) return;
        const initializeFeed = async () => {
            setItems([]);
            setHasMore(true);
            hasMoreRef.current = true;
            setLoading(false);
            loadingRef.current = false;
            isInitTriedRef.current = false;
            await loadMore();
        };

        initializeFeed();
    }, [enabled, loadMore]);

    return {
        items,
        loadMore,
        retryLoad,
        loading,
        hasMore,
        error,
        scrapFolder: handleScrapFolder,
        scrapLoading,
    };
}
