import React from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useContext } from 'react';
import { useAuthStore } from '@/stores/authStore';
import useFolderDetail from '@/features/folderDetail/hooks/useFolderDetail';
import useCreate from '@/features/create/hooks/useCreate';
import FolderHeader from '@/features/folderDetail/components/FolderHeader';
import LinkList from '@/features/folderDetail/components/LinkList';
import CreateDropdown from '@/features/create/components/CreateDropdown';

const routeApi = getRouteApi('/storage/$folderId');

export default function StorageFolderDetail() {
    // Route API 방식으로 파라미터 추출
    const { folderId } = routeApi.useParams();

    // URL 파라미터에서 정보 추출
    const searchParams = new URLSearchParams(window.location.search);
    const defaultFolderId = searchParams.get('defaultFolderId');
    const allFoldersParam = searchParams.get('allFolders');

    // 전체 폴더 정보 파싱
    const parsedAllFolders = allFoldersParam ? JSON.parse(decodeURIComponent(allFoldersParam)) : [];

    // 사용자 정보 가져오기
    const { user } = useAuthStore();
    const userId = user?.userId;

    // 폴더 상세 정보 및 링크 목록 조회
    const { folderInfo, links, loading, error, refetch } = useFolderDetail(folderId);

    // useCreate 훅 사용 (URL 파라미터로 받은 전체 폴더 + 현재 폴더 ID, 디폴트 폴더 ID)
    const { addLink, showLinkModal, openLinkModal, closeLinkModal, folders } = useCreate(
        parsedAllFolders, // URL 파라미터로 받은 전체 폴더 정보
        userId,
        refetch,
        defaultFolderId,
        folderId // 현재 폴더 ID를 기본값으로 설정
    );

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
            <FolderHeader folderInfo={folderInfo} />
            <LinkList links={links} folderInfo={folderInfo} userId={userId} refetch={refetch} />

            {/* Create 버튼 (링크 추가만) */}
            <CreateDropdown
                openFolderModal={() => {}} // 폴더 생성은 비활성화
                openLinkModal={openLinkModal}
                showFolderModal={false}
                showLinkModal={showLinkModal}
                closeFolderModal={() => {}}
                closeLinkModal={closeLinkModal}
                addFolder={() => {}}
                addLink={addLink}
                folders={folders}
                showFolderCreate={false}
            />
        </div>
    );
}
