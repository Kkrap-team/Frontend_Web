import { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { getFolderPermissionList, grantFolderPermission, revokeFolderPermission } from '../api/folderPermissionApi';

export default function usePermissionUsers(userId, onFoldersUpdate, enabled = true) {
    const { showConfirm } = useModal();
    // 팔로잉 목록 상태
    const [users, setUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [notInvitedUsers, setNotInvitedUsers] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 권한 모달 상태
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [targetFolder, setTargetFolder] = useState(null);

    // 팔로잉 목록 조회 (폴더가 선택되었을 때만) - 비회원일 때는 호출하지 않음
    useEffect(() => {
        if (!enabled || !userId || !targetFolder) return;

        setLoading(true);
        setError(null);

        getFolderPermissionList(targetFolder.folderId)
            .then((data) => {
                setUsers(data.allCandidates || []); // 전체 후보들
                setInvitedUsers(data.invited || []); // 초대된 사용자들
                setNotInvitedUsers(data.notInvited || []); // 미초대 사용자들
                setOwner(data.owner); // owner 정보 저장
                setError(null);
            })
            .catch((err) => {
                console.error('팔로잉 목록 불러오기 실패:', err);
                setError(err);
                setUsers([]);
                setInvitedUsers([]);
                setNotInvitedUsers([]);
                setOwner(null);
            })
            .finally(() => setLoading(false));
    }, [enabled, userId, targetFolder]);

    // 권한 모달 열기
    const openPermissionModal = (folder) => {
        if (!enabled) return;
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
        if (!enabled) return;
        if (selectedUsers.length === 0) {
            showConfirm({
                title: '선택 필요',
                message: '권한을 부여할 사용자를 선택해주세요.',
                confirmText: '확인',
                confirmType: 'save',
                onConfirm: () => {},
            });
            return;
        }

        try {
            // 선택된 유저들의 followingId를 배열로 변환
            const invitedUserIds = selectedUsers.map((user) => user.followingId);

            await grantFolderPermission(userId, targetFolder.folderId, invitedUserIds);
            console.log('셀렉트유저', selectedUsers);
            console.log('invitedUserIds', invitedUserIds);

            // 선택된 사용자들의 닉네임을 문자열로 변환
            const selectedNicknames = selectedUsers.map((user) => user.nickname).join(', ');

            showConfirm({
                title: '권한 부여 완료',
                message: `${selectedNicknames}님에게 권한을 부여했습니다.`,
                confirmText: '확인',
                confirmType: 'save',
                onConfirm: () => {
                    closePermissionModal();

                    // 권한 모달 목록 새로고침
                    if (targetFolder) {
                        getFolderPermissionList(targetFolder.folderId)
                            .then((data) => {
                                setUsers(data.allCandidates || []); // 전체 후보들
                                setInvitedUsers(data.invited || []); // 초대된 사용자들
                                setNotInvitedUsers(data.notInvited || []); // 미초대 사용자들
                                setOwner(data.owner); // owner 정보 업데이트
                            })
                            .catch((err) => console.error('목록 새로고침 실패:', err));
                    }

                    // 메인 페이지 폴더 목록 새로고침 (나와 공유된 폴더 업데이트)
                    if (onFoldersUpdate) {
                        onFoldersUpdate();
                    }
                },
            });
        } catch (error) {
            console.error('권한 부여 실패:', error);
            showConfirm({
                title: '권한 부여 실패',
                message: '권한 부여에 실패했습니다. 다시 시도해주세요.',
                confirmText: '확인',
                confirmType: 'save',
                onConfirm: () => {},
            });
        }
    };

    // 권한 삭제 함수
    const handlePermissionRevoke = async (invitedUserId) => {
        if (!enabled) return;
        if (!targetFolder) return;

        // 삭제할 사용자 정보 찾기
        const userToDelete = users.find((user) => user.followingId === invitedUserId);
        const userName = userToDelete ? userToDelete.nickname : '사용자';

        showConfirm({
            title: '권한 삭제 확인',
            message: `정말로 ${userName}님의 폴더 권한을 삭제하시겠습니까?`,
            confirmText: '삭제',
            cancelText: '취소',
            confirmType: 'delete',
            onConfirm: async () => {
                try {
                    await revokeFolderPermission(userId, targetFolder.folderId, invitedUserId);

                    showConfirm({
                        title: '권한 삭제 완료',
                        message: '권한이 성공적으로 삭제되었습니다.',
                        confirmText: '확인',
                        confirmType: 'save',
                        onConfirm: () => {
                            // 권한 모달 목록 새로고침
                            getFolderPermissionList(targetFolder.folderId)
                                .then((data) => {
                                    setUsers(data.allCandidates || []); // 전체 후보들
                                    setInvitedUsers(data.invited || []); // 초대된 사용자들
                                    setNotInvitedUsers(data.notInvited || []); // 미초대 사용자들
                                    setOwner(data.owner); // owner 정보 업데이트
                                })
                                .catch((err) => console.error('목록 새로고침 실패:', err));

                            // 메인 페이지 폴더 목록 새로고침 (나와 공유된 폴더 업데이트)
                            if (onFoldersUpdate) {
                                onFoldersUpdate();
                            }
                        },
                    });
                } catch (error) {
                    console.error('권한 삭제 실패:', error);
                    showConfirm({
                        title: '권한 삭제 실패',
                        message: '권한 삭제에 실패했습니다.',
                        confirmText: '확인',
                        confirmType: 'save',
                        onConfirm: () => {},
                    });
                }
            },
        });
    };

    return {
        // 팔로잉 목록
        users,
        invitedUsers,
        notInvitedUsers,
        owner, // owner 정보 추가
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
