import FolderCard from './MyFolderCard';
import '@/features/storage/styles/MyFolderList.css';

// 내 폴더 목록 컴포넌트
export default function FolderList({ folders, onDelete, onEdit, onPermission, defaultFolderId, allFolders, showMenu = true, showLockIcon = false }) {
    return (
        <div className="FolderList">
            {folders.map((folder) => (
                <FolderCard
                    key={folder.folderId}
                    folder={folder}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onPermission={onPermission}
                    defaultFolderId={defaultFolderId}
                    allFolders={allFolders}
                    showMenu={showMenu}
                    showLockIcon={showLockIcon}
                />
            ))}
        </div>
    );
}
