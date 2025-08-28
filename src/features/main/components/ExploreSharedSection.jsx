import React, { useEffect, useRef, useState, useCallback } from 'react';
import useRecommendedFeed from '@/features/main/hooks/useRecommendedFeed';
import useNoAuthMainFeed from '@/features/main/hooks/useNoAuthMainFeed';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import UserFolderCardHeader from './UserFolderCardHeader';
import '../styles/ExploreSharedSection.css';
import '../styles/UserFolderCardHeader.css';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { useNavigate } from '@tanstack/react-router';

export default function ExploreSharedSection() {
    const { user } = useAuthStore();
    const userId = user?.userId;
    const isLoggedIn = !!user;
    const { showConfirm } = useModal();
    const navigate = useNavigate();

    // 훅은 항상 호출하고 내부 동작만 enabled로 제어
    const memberFeed = useRecommendedFeed(isLoggedIn);
    const noAuthFeed = useNoAuthMainFeed(!isLoggedIn);

    // 현재 사용할 피드 데이터 결정
    const currentFeed = isLoggedIn ? memberFeed : noAuthFeed;
    const { items, loadMore, loading, hasMore, scrapFolder, scrapLoading } = currentFeed || {};

    const sentinelRef = useRef(null);
    const ioRef = useRef(null);
    const lastLoadAtRef = useRef(0);
    const MIN_GAP_MS = 1200;
    const [waiting, setWaiting] = useState(false);
    const waitingRef = useRef(false);
    useEffect(() => {
        waitingRef.current = waiting;
    }, [waiting]);
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

    const leftBottomOnceRef = useRef(false);

    // loadMore 이후 상태 안전장치 (회원만 해당)
    const safeLoadMore = useCallback(() => {
        if (!isLoggedIn || !loadMore) return; // 비회원은 무한스크롤 없음

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
    }, [isLoggedIn, loadMore]);

    // 폴더 스크랩 처리 (회원만 가능)
    const handleScrapFolder = async (folderData) => {
        if (!isLoggedIn) {
            showConfirm({
                title: '로그인 필요',
                message: '폴더 스크랩은 로그인이 필요합니다. 로그인하시겠습니까?',
                confirmText: '로그인',
                cancelText: '취소',
                onConfirm: () => navigate({ to: '/login' }),
            });
            return;
        }

        try {
            const result = await scrapFolder(folderData);
            if (result?.success) {
                showConfirm({
                    title: '스크랩 완료',
                    message: '폴더가 내 보관함에 스크랩되었습니다.',
                    confirmText: '확인',
                });
            } else {
                showConfirm({
                    title: '스크랩 실패',
                    message: '스크랩 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
                    confirmText: '확인',
                });
            }
        } catch (e) {
            showConfirm({
                title: '스크랩 실패',
                message: '스크랩 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
                confirmText: '확인',
            });
        }
    };

    // 무한스크롤 설정 (회원만)
    useEffect(() => {
        if (!isLoggedIn || !sentinelRef.current) return;

        const options = { root: null, rootMargin: '0px 0px 800px 0px', threshold: 0 };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                // 바닥에 도달했으나 hasMore=false 상태에서 한번 위로 올랐다가 다시 내려오면 재시도 허용
                if (!hasMore && !loading && !waitingRef.current) {
                    if (leftBottomOnceRef.current) {
                        leftBottomOnceRef.current = false;
                        if (typeof currentFeed?.retryLoad === 'function') {
                            currentFeed.retryLoad();
                        }
                    }
                    return;
                }
                if (!hasMore || loading || waitingRef.current) return;
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
    }, [userId, isLoggedIn, hasMore, loading, safeLoadMore]);

    // 사용자가 바닥에서 위로 올라갔다가 다시 내려오면 재시도 플래그 on
    useEffect(() => {
        const onScroll = () => {
            if (!isLoggedIn) return;
            const doc = document.documentElement;
            const distanceToBottom = doc.scrollHeight - window.innerHeight - window.scrollY;

            if (!hasMore && !loading && !waitingRef.current) {
                // 충분히 위로 올라가면 재시도 허용 플래그 on
                if (distanceToBottom > 200) {
                    leftBottomOnceRef.current = true;
                }
                // 다시 바닥에 가까워지면 한 번 재시도
                if (leftBottomOnceRef.current && distanceToBottom < 120) {
                    leftBottomOnceRef.current = false;
                    if (typeof currentFeed?.retryLoad === 'function') {
                        currentFeed.retryLoad();
                    }
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isLoggedIn, hasMore, loading, currentFeed]);

    // 비회원일 때는 간단한 폴더 목록만 표시
    if (!isLoggedIn) {
        return (
            <section className="ExploreSharedSection">
                <div className="ExploreInner">
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
                        <div className="ExploreError">폴더를 불러오는데 실패했습니다. 다시 시도해주세요.</div>
                    )}
                </div>
            </section>
        );
    }

    // 회원용 기존 렌더링
    return (
        <section className="ExploreSharedSection">
            <div className="ExploreInner">
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
                    <div className="ExploreLoading ExploreWaiting" role="status" aria-live="polite">
                        <span className="ExploreSpinner" />
                        <span className="ExploreLoadingText">{waiting ? '잠시만요…' : '불러오는 중…'}</span>
                    </div>
                )}

                {!hasMore && items.length > 0 && (
                    <div className="ExploreEnd ExploreFloating">표시할 컨텐츠가 없어요</div>
                )}

                {!loading && !waiting && items.length === 0 && (
                    <div className="ExploreEnd ExploreFloating">표시할 컨텐츠가 없어요</div>
                )}
            </div>
        </section>
    );
}
