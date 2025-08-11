import React, { useEffect, useRef, useState } from 'react';
import useRecommendedFeed from '@/features/main/hooks/useRecommendedFeed';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import '../styles/ExploreSharedSection.css';
import { useAuthStore } from '@/stores/authStore';

export default function ExploreSharedSection() {
    const { user } = useAuthStore();
    const userId = user?.userId;

    const { items, loadMore, loading, hasMore } = useRecommendedFeed(userId);
    const sentinelRef = useRef(null);
    const ioRef = useRef(null);
    const lastLoadAtRef = useRef(0);
    const MIN_GAP_MS = 1200;
    const [waiting, setWaiting] = useState(false);
    const gapTimerRef = useRef(null);

    const reobserveSentinel = () => {
        const sentinel = sentinelRef.current;
        const io = ioRef.current;
        if (sentinel && io) {
            try {
                io.unobserve(sentinel);
                io.observe(sentinel);
            } catch (_) {}
        }
    };

    // loadMore 이후 상태 안전장치
    const safeLoadMore = () => {
        try {
            const maybePromise = loadMore();
            if (maybePromise && typeof maybePromise.finally === 'function') {
                maybePromise.finally(() => setWaiting(false));
            } else {
                setWaiting(false);
            }
        } catch (_) {
            setWaiting(false);
        }
    };

    useEffect(() => {
        if (!sentinelRef.current) return;
        const options = { root: null, rootMargin: '0px 0px 800px 0px', threshold: 0 };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                if (!hasMore || loading || waiting) return;
                const now = Date.now();
                const delta = now - lastLoadAtRef.current;
                const remaining = MIN_GAP_MS - delta;
                if (remaining > 0) {
                    setWaiting(true);
                    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
                    gapTimerRef.current = setTimeout(() => {
                        lastLoadAtRef.current = Date.now();
                        safeLoadMore();
                        setTimeout(reobserveSentinel, 0);
                    }, remaining);
                    return;
                }
                lastLoadAtRef.current = now;
                safeLoadMore();
                setTimeout(reobserveSentinel, 0);
            });
        }, options);
        ioRef.current = io;
        io.observe(sentinelRef.current);
        return () => {
            io.disconnect();
            ioRef.current = null;
            if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
        };
    }, [userId]);

    if (!user) return null;

    return (
        <section className="ExploreSharedSection">
            <div className="ExploreHeaderRow">
                <h2 className="ExploreTitle">공유 폴더 둘러보기</h2>
            </div>

            <div className="ExploreGrid">
                {items.map((folder, idx) => {
                    const displayName = folder.nickname ?? '사용자';
                    const avatarSrc = folder.profileImage ?? '/Kkrap_logo.png';

                    const links =
                        folder.thumbnailUrl || folder.faviconUrl
                            ? [{ thumbnailUrl: folder.thumbnailUrl, faviconUrl: folder.faviconUrl }]
                            : [];
                    const adaptedFolder = { ...folder, links };

                    return (
                        <div key={`${folder.folderId}-${idx}`} className="ExploreCard">
                            <div className="ExploreCardHeader">
                                <div className="ExploreUser">
                                    <img
                                        className="ExploreAvatar"
                                        src={avatarSrc}
                                        alt="user"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/Kkrap_logo.png';
                                        }}
                                    />
                                    <span className="ExploreUserName">{displayName}</span>
                                </div>
                                <button className="ExploreMore">⋮</button>
                            </div>
                            <MyFolderCard folder={adaptedFolder} />
                        </div>
                    );
                })}
            </div>

            {hasMore && <div ref={sentinelRef} className="ExploreSentinel" style={{ height: 1 }} />}

            {(loading || waiting) && (
                <div className="ExploreLoading" role="status" aria-live="polite">
                    <span className="ExploreSpinner" aria-hidden="true" />
                    <span className="ExploreLoadingText">{waiting ? '잠시만요…' : '불러오는 중…'}</span>
                </div>
            )}

            {!hasMore && items.length > 0 && <div className="ExploreEnd">더 이상 표시할 콘텐츠가 없어요</div>}
        </section>
    );
}
