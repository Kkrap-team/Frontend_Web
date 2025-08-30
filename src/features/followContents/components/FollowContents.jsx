import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import UserFolderCardHeader from '@/features/main/components/UserFolderCardHeader';
import useFollowContents from '../hooks/useFollowContents';
import styles from '../styles/FollowContents.module.css';
import { useNavigate } from '@tanstack/react-router';
import { scrapFolder as scrapFolderApi } from '@/features/main/api/recommendApi';

const FollowContents = () => {
    const { user } = useAuthStore();
    const { showConfirm } = useModal();
    const navigate = useNavigate();
    const { contents, loading, error } = useFollowContents();

    // 로컬 뷰 상태(스크랩 카운트 등 미세 업데이트)
    const [list, setList] = useState([]);
    useEffect(() => {
        setList(contents || []);
    }, [contents]);

    // 폴더 스크랩 처리 (자신의 폴더 체크 포함)
    const handleScrapFolder = async (folderData) => {
        // 자신의 폴더인지 확인
        if (folderData?.userId && user?.userId && folderData.userId === user.userId) {
            showConfirm({
                title: '스크랩 불가',
                message: '자신의 폴더는 스크랩할 수 없습니다.',
                confirmText: '확인',
                cancelText: null,
                onConfirm: () => {
                    // 확인 후 아무것도 하지 않음
                },
            });
            return;
        }

        // 비로그인 안내
        if (!user) {
            showConfirm({
                title: '로그인 필요',
                message: '폴더 스크랩은 로그인이 필요합니다. 로그인하시겠습니까?',
                confirmText: '로그인',
                cancelText: '취소',
                onConfirm: () => navigate({ to: '/login' }),
            });
            return;
        }

        // 다른 사용자의 폴더인 경우 정상 스크랩 처리
        try {
            const payload = {
                sourceFolderId: folderData.folderId,
                folderName: folderData.folderName,
                folderDescription: folderData.folderDescription,
                visible: folderData.visible,
            };
            await scrapFolderApi(payload);
            showConfirm({
                title: '스크랩 완료',
                message: '폴더가 내 보관함에 스크랩되었습니다.',
                confirmText: '확인',
                onConfirm: () => {},
            });
        } catch (e) {
            console.error('스크랩 실패:', e);
            showConfirm({
                title: '스크랩 실패',
                message: '스크랩 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
                confirmText: '확인',
            });
        }
    };

    if (loading) {
        return (
            <div className={styles.followContentsContainer}>
                <div className={styles.loadingContainer}>팔로우 컨텐츠를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.followContentsContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorMessage}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.followContentsContainer}>
            <div className={styles.followContentsGrid}>
                {list.map((content, index) => {
                

                    return (
                        <div key={content.folderId || content.id || index} className={styles.folderCardWrapper}>
                            {/* 폴더 카드 위에 사용자 헤더 추가 */}
                            <UserFolderCardHeader
                                displayName={content.nickname || '사용자'}
                                avatarSrc={content.profile || '/Kkrap_logo.png'}
                                onMoreClick={() => console.log('더보기:', content.folderId)}
                                showMoreButton={true}
                                onScrap={(folderData) => handleScrapFolder(folderData)}
                                folderData={{
                                    ...content,
                                    userId: content.userId,
                                }}
                                disabled={false}
                                userFolderCreateTime={content.createdAt}
                            />

                            {/* 폴더 카드 */}
                            <MyFolderCard
                                folder={{
                                    ...content,
                                    links:
                                        Array.isArray(content.links) && content.links.length > 0
                                            ? content.links
                                            : content.thumbnailUrl || content.faviconUrl
                                              ? [{ thumbnailUrl: content.thumbnailUrl, faviconUrl: content.faviconUrl }]
                                              : [],
                                }}
                                onDelete={() => console.log('삭제:', content.folderId)}
                                onEdit={() => console.log('수정:', content.folderId)}
                                onPermission={() => console.log('권한:', content.folderId)}
                                showMenu={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FollowContents;
