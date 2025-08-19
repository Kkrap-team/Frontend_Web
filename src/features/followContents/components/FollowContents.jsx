import React from 'react';
import useFollowContents from '../hooks/useFollowContents';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import UserFolderCardHeader from '@/features/main/components/UserFolderCardHeader';
import styles from '../styles/FollowContents.module.css';

export default function FollowContents() {
    const { contents, loading, error} = useFollowContents();

    if (loading) {
        return (
            <div className={styles.followContentsContainer}>
                <div className={styles.loadingContainer}>
                    팔로우 컨텐츠를 불러오는 중...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.followContentsContainer}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
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
                                onScrap={(folderData) => {
                                    console.log('스크랩 시도:', folderData);
                                    // TODO: 실제 스크랩 API 호출
                                    alert('스크랩 기능은 준비 중입니다.');
                                }}
                                folderData={{
                                    ...content,
                                    userId: content.userId
                                }}
                                disabled={false}
                                userFolderCreateTime={content.createdAt}
                            />
                            
                            {/* 폴더 카드 */}
                            <MyFolderCard 
                                folder={content}
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
}


