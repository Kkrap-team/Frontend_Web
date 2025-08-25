import React, { useEffect, useRef, useState } from 'react';
import useRecommendedFeed from '@/features/main/hooks/useRecommendedFeed';
import useNoAuthMainFeed from '@/features/main/hooks/useNoAuthMainFeed';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import UserFolderCardHeader from './UserFolderCardHeader';
import '../styles/ExploreSharedSection.css';
import '../styles/UserFolderCardHeader.css';
import { useAuthStore } from '@/stores/authStore';

export default function ExploreSharedSection() {
    const { user } = useAuthStore();
    const userId = user?.userId;
    const isLoggedIn = !!user;

    // 로그인 상태에 따라 다른 훅 사용 - 조건부 호출로 변경
    const memberFeed = isLoggedIn ? useRecommendedFeed() : null;
    const noAuthFeed = !isLoggedIn ? useNoAuthMainFeed() : null;

    // 현재 사용할 피드 데이터 결정
    const currentFeed = isLoggedIn ? memberFeed : noAuthFeed;
    const { items, loadMore, loading, hasMore, scrapFolder, scrapLoading } = currentFeed || {};

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

    // loadMore 이후 상태 안전장치 (회원만 해당)
    const safeLoadMore = () => {
        if (!isLoggedIn) return; // 비회원은 무한스크롤 없음
        
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

    // 폴더 스크랩 처리 (회원만 가능)
    const handleScrapFolder = async (folderData) => {
        if (!isLoggedIn) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        // UserFolderCardHeader에서 이미 자신의 폴더 체크를 수행하므로
        // 여기서는 바로 스크랩 처리만 진행
        const result = await scrapFolder(folderData);

        if (result.success) {
            alert('폴더가 성공적으로 스크랩되었습니다!');
        } else {
            alert('폴더 스크랩에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 무한스크롤 설정 (회원만)
    useEffect(() => {
        if (!isLoggedIn || !sentinelRef.current) return;
        
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
    }, [userId, isLoggedIn, hasMore, loading, waiting]);

    // 비회원일 때는 간단한 폴더 목록만 표시
    if (!isLoggedIn) {
        return (
            <section className="ExploreSharedSection">
                <div className="ExploreHeaderRow">
                    <h2 className="ExploreTitle">폴더 둘러보기</h2>
                </div>

                <div className="ExploreGrid">
                    {noAuthFeed?.items.map((folder, idx) => {
                        const displayName = folder.nickname ?? '사용자';
                        const avatarSrc = folder.profileImage ?? '/Kkrap_logo.png';
                        const userFolderCreateTime = folder.createTime;

                        const links =
                            folder.thumbnailUrl || folder.faviconUrl
                                ? [{ thumbnailUrl: folder.thumbnailUrl, faviconUrl: folder.faviconUrl }]
                                : [];
                        const adaptedFolder = { ...folder, links };

                        return (
                            <div key={`${folder.folderId}-${idx}`} className="ExploreCard">
                                <UserFolderCardHeader
                                    displayName={displayName}
                                    avatarSrc={avatarSrc}
                                    onScrap={handleScrapFolder}
                                    folderData={folder}
                                    disabled={true} // 비회원은 스크랩 불가
                                    userFolderCreateTime={userFolderCreateTime}
                                />
                                <MyFolderCard folder={adaptedFolder} showMenu={false} />
                            </div>
                        );
                    })}
                </div>

                {noAuthFeed?.loading && (
                    <div className="ExploreLoading" role="status" aria-live="polite">
                        <span className="ExploreSpinner" aria-hidden="true" />
                        <span className="ExploreLoadingText">불러오는 중…</span>
                    </div>
                )}

                {noAuthFeed?.error && (
                    <div className="ExploreError">
                        폴더를 불러오는데 실패했습니다. 다시 시도해주세요.
                    </div>
                )}
            </section>
        );
    }

    // 회원용 기존 렌더링
    return (
        <section className="ExploreSharedSection">
            <div className="ExploreHeaderRow">
                <h2 className="ExploreTitle">폴더 둘러보기</h2>
            </div>

            <div className="ExploreGrid">
                {items.map((folder, idx) => {
                    const displayName = folder.nickname ?? '사용자';
                    const avatarSrc = folder.profileImage ?? '/Kkrap_logo.png';
                    const userFolderCreateTime = folder.createTime;

                    const links =
                        folder.thumbnailUrl || folder.faviconUrl
                            ? [{ thumbnailUrl: folder.thumbnailUrl, faviconUrl: folder.faviconUrl }]
                            : [];
                    const adaptedFolder = { ...folder, links };

                    return (
                        <div key={`${folder.folderId}-${idx}`} className="ExploreCard">
                            <UserFolderCardHeader
                                displayName={displayName}
                                avatarSrc={avatarSrc}
                                onScrap={handleScrapFolder}
                                folderData={folder}
                                disabled={scrapLoading}
                                userFolderCreateTime={userFolderCreateTime}
                            />
                            <MyFolderCard folder={adaptedFolder} showMenu={false} />
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
