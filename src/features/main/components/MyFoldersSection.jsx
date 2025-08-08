import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import useMyFolder from '@/features/storage/hooks/useMyFolder';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import '../styles/MyFoldersSection.css';

const MyFoldersSection = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
    const { ownFolders = [], sharedFolders = [] } = useMyFolder(userId) || {};

    // 전체 폴더 배열 생성 (own + shared)
    const allFolders = [
        ...ownFolders.map((folder) => ({ ...folder, type: 'own' })),
        ...sharedFolders.map((folder) => ({ ...folder, type: 'shared' })),
    ];

    // 디폴트 폴더 ID (ownFolders의 첫 번째 폴더)
    const defaultFolderId = ownFolders.length > 0 ? ownFolders[0].folderId : null;

    return (
        <>
            {/* 나의 폴더 섹션 */}
            <div className="MyFoldersSection">
                <div className="SectionHeader">
                    <h2 className="SectionTitle">{user ? `${user.nickname}님의 폴더` : '나의 폴더'}</h2>
                    <span className="SectionArrow">&gt;</span>
                </div>
                <div className="FoldersGrid">
                    {ownFolders.map((folder) => (
                        <MyFolderCard
                            key={folder.folderId}
                            folder={folder}
                            allFolders={allFolders}
                            defaultFolderId={defaultFolderId}
                        />
                    ))}
                </div>
            </div>

            {/* 공유된 폴더 섹션 */}
            <div className="SharedFoldersSection">
                <div className="SectionHeader">
                    <h2 className="SectionTitle">{user ? `${user.nickname}님과 공유된 폴더` : '공유된 폴더'}</h2>
                    <span className="SectionArrow">&gt;</span>
                </div>
                <div className="FoldersGrid">
                    {sharedFolders.map((folder) => (
                        <MyFolderCard
                            key={folder.folderId}
                            folder={folder}
                            allFolders={allFolders}
                            defaultFolderId={defaultFolderId}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyFoldersSection;
