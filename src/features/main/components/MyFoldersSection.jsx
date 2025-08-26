import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import useMyFolder from '@/features/storage/hooks/useMyFolder';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import '../styles/MyFoldersSection.css';
import { useNavigate } from '@tanstack/react-router';

const MyFoldersSection = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const userId = user?.userId;
    const { ownFolders = [], sharedFolders = [] } = useMyFolder(userId) || {};

    // 전체 폴더 배열 생성 (own + shared)
    const allFolders = [
        ...ownFolders.map((folder) => ({ ...folder, type: 'own' })),
        ...sharedFolders.map((folder) => ({ ...folder, type: 'shared' })),
    ];

    const renderGridContent = (folders) => {
        if (!user) {
            return (
                <div className="EmptyState">
                    <img
                        className="EmptyIcon"
                        src="/preview_folders.png"
                        alt="빈 폴더"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                        }}
                    />
                    <div className="EmptyTexts">
                        <div className="EmptyTitle">생성된 폴더가 없어요</div>
                        <div className="EmptyDesc">(로그인 후 이용해보세요!)</div>
                    </div>
                </div>
            );
        }

        return folders.map((folder) => (
            <MyFolderCard
                key={folder.folderId}
                folder={folder}
                allFolders={allFolders}
                showMenu={false}
                showLockIcon={true}
            />
        ));
    };

    return (
        <>
            {/* 나의 폴더 섹션 */}
            <div className="MyFoldersSection">
                <div className="ExploreInner">
                    <div className="SectionHeader">
                        <h2 className="SectionTitle">{user ? `${user.nickname}님의 폴더` : '나의 폴더'}</h2>
                        <span className="SectionArrow" onClick={() => navigate({ to: `/storage/${userId}` })}>
                            &gt;
                        </span>
                    </div>
                    <div className={`FoldersGrid${!user ? ' FoldersGridEmpty' : ''}`}>
                        {renderGridContent(ownFolders)}
                    </div>
                </div>
            </div>

            {/* 공유된 폴더 섹션 - 회원일 때만 표시 */}
            {user && (
                <div className="SharedFoldersSection">
                    <div className="ExploreInner">
                        <div className="SectionHeader">
                            <h2 className="SectionTitle">{`${user.nickname}님과 공유된 폴더`}</h2>
                            <span className="SectionArrow" onClick={() => navigate({ to: `/storage/${userId}` })}>
                                &gt;
                            </span>
                        </div>
                        <div className="FoldersGrid">{renderGridContent(sharedFolders)}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyFoldersSection;
