import React from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import useFolderDetail from '@/features/folderDetail/hooks/useFolderDetail';
import FolderDetailHeader from '@/features/folderDetail/components/FolderDetailHeader';
import LinkList from '@/features/folderDetail/components/LinkList';
import CreateModal from '@/features/create/components/CreateModal';
import { getFolderPermissionList } from '@/features/storage/api/folderPermissionApi';
import PermissionModal from '@/features/storage/components/PermissionModal';
import usePermissionUsers from '@/features/storage/hooks/usePermissionUsers';

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

    // 링크 추가는 CreateDropdown 내부에서 독립적으로 처리

    // 권한 데이터: 페이지 진입 시 1회 로드 → 아이콘/모달에서 공통 사용
    const [permData, setPermData] = React.useState(null);
    const [permLoading, setPermLoading] = React.useState(false);
    // 모달 동작은 훅에서 관리

    React.useEffect(() => {
        if (!folderId || !folderInfo || folderInfo.share === false) {
            // 공유되지 않은 폴더면 요청 스킵 및 상태 초기화
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
    }, [folderId, folderInfo]);

    // 아이콘 표시에 사용할 원본 invited 목록만 전달 (가공은 컴포넌트가 담당)
    const invitedUsers = Array.isArray(permData?.invited) ? permData.invited : [];

    // 훅: 모달 동작(선택/부여/삭제) 담당. 성공 후 페이지 권한 데이터 새로고침
    const refreshPermData = React.useCallback(() => {
        if (!folderId || !folderInfo || folderInfo.share === false) return;
        setPermLoading(true);
        getFolderPermissionList(folderId)
            .then((data) => setPermData(data))
            .finally(() => setPermLoading(false));
    }, [folderId, folderInfo]);

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
    } = usePermissionUsers(userId, refreshPermData);

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

    return (
        <div>
            <FolderDetailHeader folderInfo={folderInfo} />
            <LinkList
                links={links}
                folderInfo={folderInfo}
                userId={userId}
                refetch={refetch}
                invitedUsers={invitedUsers}
                sharingLoading={permLoading}
                onOpenPermission={() => openPermissionModal({ folderId, folderName: folderInfo?.folderName })}
            />

            {/* Create 버튼 (링크 추가만) */}
            <CreateModal showFolderCreate={false} onSuccess={refetch} />
            {showPermissionModal && (
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
        </div>
    );
}
