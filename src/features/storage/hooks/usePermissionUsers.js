import { useState, useEffect } from 'react';
import { getFolderPermissionList, grantFolderPermission, revokeFolderPermission } from '../api/folderPermissionApi';

export default function usePermissionUsers(userId, onFoldersUpdate) {
    // 팔로잉 목록 상태
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 권한 모달 상태
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [targetFolder, setTargetFolder] = useState(null);

    // 팔로잉 목록 조회 (폴더가 선택되었을 때만)
    useEffect(() => {
        if (!userId || !targetFolder) return;

        setLoading(true);
        setError(null);

        getFolderPermissionList(userId, targetFolder.folderId)
            .then((data) => {
                setUsers(data || []);
                setError(null);
            })
            .catch((err) => {
                console.error('팔로잉 목록 불러오기 실패:', err);
                setError(err);
                setUsers([]);
            })
            .finally(() => setLoading(false));
    }, [userId, targetFolder]);

    // 권한 모달 열기
    const openPermissionModal = (folder) => {
        setTargetFolder(folder);
        setSelectedUsers([]);
        setShowPermissionModal(true);
    };

    // 권한 모달 닫기
    const closePermissionModal = () => {
        setShowPermissionModal(false);
        setTargetFolder(null);
        setSelectedUsers([]);
    };

    // 유저 선택/해제
    const handleUserSelect = (user) => {
        setSelectedUsers((prev) => {
            const isSelected = prev.some((selected) => selected.followingId === user.followingId);
            if (isSelected) {
                return prev.filter((selected) => selected.followingId !== user.followingId);
            } else {
                return [...prev, user];
            }
        });
    };

    // 권한 부여 확인
    const handlePermissionConfirm = async () => {
        if (selectedUsers.length === 0) {
            alert('권한을 부여할 사용자를 선택해주세요.');
            return;
        }

        try {
            // 선택된 유저들의 followingId를 배열로 변환
            const invitedUserIds = selectedUsers.map((user) => user.followingId);

            await grantFolderPermission(userId, targetFolder.folderId, invitedUserIds);

            alert(`${selectedUsers.length}명의 사용자에게 권한을 부여했습니다.`);
            closePermissionModal();

            // 권한 모달 목록 새로고침
            if (targetFolder) {
                getFolderPermissionList(userId, targetFolder.folderId)
                    .then((data) => setUsers(data || []))
                    .catch((err) => console.error('목록 새로고침 실패:', err));
            }

            // 메인 페이지 폴더 목록 새로고침 (나와 공유된 폴더 업데이트)
            if (onFoldersUpdate) {
                onFoldersUpdate();
            }
        } catch (error) {
            console.error('권한 부여 실패:', error);
            alert('권한 부여에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 권한 삭제 함수
    const handlePermissionRevoke = async (invitedUserId) => {
        if (!targetFolder) return;

        const confirmRevoke = window.confirm('정말로 이 사용자의 폴더 권한을 삭제하시겠습니까?');
        if (!confirmRevoke) return;

        try {
            await revokeFolderPermission(userId, targetFolder.folderId, invitedUserId);
            alert('권한이 성공적으로 삭제되었습니다.');

            // 권한 모달 목록 새로고침
            getFolderPermissionList(userId, targetFolder.folderId)
                .then((data) => setUsers(data || []))
                .catch((err) => console.error('목록 새로고침 실패:', err));

            // 메인 페이지 폴더 목록 새로고침 (나와 공유된 폴더 업데이트)
            if (onFoldersUpdate) {
                onFoldersUpdate();
            }
        } catch (error) {
            console.error('권한 삭제 실패:', error);
            alert('권한 삭제에 실패했습니다.');
        }
    };

    return {
        // 팔로잉 목록
        users,
        loading,
        error,
        // 권한 모달 상태
        showPermissionModal,
        selectedUsers,
        targetFolder,
        // 권한 모달 함수들
        openPermissionModal,
        closePermissionModal,
        handleUserSelect,
        handlePermissionConfirm,
        handlePermissionRevoke,
    };
}
