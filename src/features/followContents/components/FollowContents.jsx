import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import UserFolderCardHeader from '@/features/main/components/UserFolderCardHeader';
import useFollowContents from '../hooks/useFollowContents';
import styles from '../styles/FollowContents.module.css';

const FollowContents = () => {
    const { user } = useAuthStore();
    const { showConfirm } = useModal();
    const { contents, loading, error } = useFollowContents();

    // 폴더 스크랩 처리 (자신의 폴더 체크 포함)
    const handleScrapFolder = (folderData) => {
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

        // 다른 사용자의 폴더인 경우 정상 스크랩 처리
        console.log('스크랩 시도:', folderData);
        // TODO: 실제 스크랩 API 호출
        alert('스크랩 기능은 준비 중입니다.');
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
                {contents.map((content, index) => {
                    console.log(`Content ${index}:`, content);

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
