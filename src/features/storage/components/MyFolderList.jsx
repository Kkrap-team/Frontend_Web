import FolderCard from './MyFolderCard';
import '@/features/storage/styles/MyFolderList.css';

// 내 폴더 목록 컴포넌트
export default function FolderList({ folders, onDelete }) {
    return (
        <div className="FolderList">
            {folders.map((folder) => (
                <FolderCard key={folder.folderId} folder={folder} onDelete={onDelete} />
            ))}
        </div>
    );
}
