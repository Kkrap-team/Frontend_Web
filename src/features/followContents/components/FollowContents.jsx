import React from 'react';
import useFollowContents from '../hooks/useFollowContents';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
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
                {contents.map((content) => (
                    <MyFolderCard 
                        key={content.folderId || content.id} 
                        folder={content}
                        onDelete={() => console.log('삭제:', content.folderId)}
                        onEdit={() => console.log('수정:', content.folderId)}
                        onPermission={() => console.log('권한:', content.folderId)}
                    />
                ))}
            </div>
        </div>
    );
}


