import React from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import useFolderDetail from '@/features/folderDetail/hooks/useFolderDetail';
import FolderDetailHeader from '@/features/folderDetail/components/FolderDetailHeader';
import { useModal } from '@/contexts/ModalContext';
import LinkList from '@/features/folderDetail/components/LinkList';
import CreateModal from '@/features/create/components/CreateModal';
import { getFolderPermissionList } from '@/features/storage/api/folderPermissionApi';
import PermissionModal from '@/features/storage/components/PermissionModal';
import usePermissionUsers from '@/features/storage/hooks/usePermissionUsers';
import FolderCreateModal from '@/features/create/components/FolderCreateModal';
import { editMyFolder, deleteMyFolder } from '@/features/storage/api/myFolderApi';

const routeApi = getRouteApi('/folder/$folderId');

export default function StorageFolderDetail() {
    // Route API 방식으로 파라미터 추출
    const { folderId } = routeApi.useParams();

    // URL 파라미터에서 정보 추출
    const searchParams = new URLSearchParams(window.location.search);
    const targetUserId = searchParams.get('targetUserId');

    // 전체 폴더 정보 파싱

    // 사용자 정보 가져오기
    const { user } = useAuthStore();
    const userId = user?.userId;

    // 폴더 상세 정보 및 링크 목록 조회
    const { folderInfo, links, loading, error, refetch } = useFolderDetail(folderId, targetUserId);

    // 링크 추가는 CreateModal 내부에서 독립적으로 처리

    // 권한 데이터: 페이지 진입 시 1회 로드 → 아이콘/모달에서 공통 사용
    const [permData, setPermData] = React.useState(null);
    const [permLoading, setPermLoading] = React.useState(false);
    // 모달 동작은 훅에서 관리

    React.useEffect(() => {
        // 비로그인이면 스킵, 그 외에는 공유 여부와 무관하게 권한 목록 조회
        if (!folderId || !user) {
            setPermData(null);
            setPermLoading(false);
            return;
        }
        let ignore = false;
        setPermLoading(true);
        getFolderPermissionList(folderId)
            .then((data) => {
                if (!ignore) setPermData(data);
            })
            .finally(() => {
                if (!ignore) setPermLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [folderId, user]);

    // 아이콘 표시에 사용할 원본 invited 목록만 전달 (가공은 컴포넌트가 담당)
    const invitedUsers = Array.isArray(permData?.invited) ? permData.invited : [];

    // 훅: 모달 동작(선택/부여/삭제) 담당. 성공 후 페이지 권한 데이터 새로고침
    const refreshPermData = React.useCallback(() => {
        // 로그인만 확인하고 항상 최신 권한 목록을 조회
        if (!folderId || !user) return;
        setPermLoading(true);
        getFolderPermissionList(folderId)
            .then((data) => setPermData(data))
            .finally(() => setPermLoading(false));
    }, [folderId, user]);

    // 훅은 항상 호출하고 enabled로 내부 동작만 제어
    const permissionHook = usePermissionUsers(userId, refreshPermData, !!user);
    const { showConfirm, showModal, hideModal } = useModal();
    const navigate = useNavigate();

    // 폴더 수정 모달 상태
    const [editOpen, setEditOpen] = React.useState(false);
    const openEdit = () => setEditOpen(true);
    const closeEdit = () => setEditOpen(false);

    const handleEditSubmit = async (data) => {
        try {
            await editMyFolder({ ...data, folderId });
            closeEdit();
            await refetch();
        } catch (e) {
            console.error(e);
        }
    };

    const {
        users: permUsers,
        invitedUsers: hookInvited,
        notInvitedUsers: hookNotInvited,
        owner: permOwner,
        loading: hookLoading,
        error: hookError,
        showPermissionModal,
        selectedUsers,
        openPermissionModal,
        closePermissionModal,
        handleUserSelect,
        handlePermissionConfirm,
        handlePermissionRevoke,
    } = permissionHook;

    // 모바일 하단 네비의 CreateModal에서 링크 생성 시 목록 갱신 이벤트 수신
    React.useEffect(() => {
        const handler = (e) => {
            const detail = e?.detail;
            const eventFolderId = detail?.folderId;
            if (!eventFolderId) return;
            if (String(eventFolderId) !== String(folderId)) return;
            refetch();
        };
        window.addEventListener('links:refresh', handler);
        return () => window.removeEventListener('links:refresh', handler);
    }, [folderId, refetch]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <p>폴더 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center' }}>
                <p>폴더 정보를 불러오는 중 오류가 발생했습니다...</p>
            </div>
        );
    }

    const isOwner =
        user && folderInfo ? String(folderInfo.ownerUserId ?? folderInfo.userId) === String(user.userId) : false;

    return (
        <div>
            <FolderDetailHeader
                folderInfo={folderInfo}
                isOwner={isOwner}
                onSettingsClick={() =>
                    showModal('folderSettings', {
                        onEdit: () => {
                            hideModal();
                            openEdit();
                        },
                        onPermission: () => {
                            hideModal();
                            openPermissionModal({ folderId, folderName: folderInfo?.folderName });
                        },
                        onDelete: () =>
                            showConfirm({
                                title: '폴더 삭제',
                                message: '정말 이 폴더를 삭제하시겠습니까? 되돌릴 수 없습니다.',
                                confirmText: '삭제',
                                cancelText: '취소',
                                confirmType: 'delete',
                                onConfirm: async () => {
                                    try {
                                        hideModal();
                                        await deleteMyFolder(folderId);
                                        navigate({ to: `/storage/${userId}` });
                                    } catch (e) {
                                        console.error(e);
                                    }
                                },
                            }),
                    })
                }
            />
            <LinkList
                links={links}
                folderInfo={folderInfo}
                userId={userId}
                refetch={refetch}
                invitedUsers={invitedUsers}
                sharingLoading={permLoading}
                onOpenPermission={() => openPermissionModal({ folderId, folderName: folderInfo?.folderName })}
            />

            {/* Create 버튼 (링크 추가만) - 회원일 때만 표시 */}
            {user && (
                <CreateModal
                    showFolderCreate={false}
                    onSuccess={(createdLink) => {
                        refetch();
                    }}
                />
            )}

            {/* 권한 모달 - 회원일 때만 표시 */}
            {user && showPermissionModal && (
                <PermissionModal
                    isOpen={showPermissionModal}
                    users={permUsers}
                    invitedUsers={hookInvited}
                    notInvitedUsers={hookNotInvited}
                    owner={permOwner}
                    selectedUsers={selectedUsers}
                    onUserSelect={handleUserSelect}
                    onClose={closePermissionModal}
                    onConfirm={handlePermissionConfirm}
                    onRevoke={handlePermissionRevoke}
                    loading={hookLoading}
                    error={hookError}
                />
            )}

            {/* 폴더 수정 모달 */}
            {isOwner && editOpen && (
                <FolderCreateModal
                    mode="edit"
                    initialData={{
                        folderId,
                        folderName: folderInfo?.folderName,
                        folderDescription: folderInfo?.folderDescription,
                        visible: folderInfo?.visible,
                    }}
                    onClose={closeEdit}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
}
