import React from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import useFolderDetail from '@/features/folderDetail/hooks/useFolderDetail';
import useCreate from '@/features/create/hooks/useCreate';
import FolderHeader from '@/features/folderDetail/components/FolderHeader';
import LinkList from '@/features/folderDetail/components/LinkList';
import CreateDropdown from '@/features/create/components/CreateDropdown';

const routeApi = getRouteApi('/storage/$folderId');

export default function StorageFolderDetail() {
    // Route API 방식으로 파라미터 추출
    const { folderId } = routeApi.useParams();

    // URL 파라미터에서 defaultFolderId 추출
    const searchParams = new URLSearchParams(window.location.search);
    const defaultFolderId = searchParams.get('defaultFolderId');

    // 사용자 정보 가져오기
    const { user } = useContext(AuthContext);
    const userId = user?.userId;

    // 폴더 상세 정보 및 링크 목록 조회
    const { folderInfo, links, loading, error, refetch } = useFolderDetail(folderId);

    // 현재 폴더만 사용
    const currentFolder = {
        folderId,
        folderName: folderInfo?.folderName || '현재 폴더',
        type: folderInfo?.share ? 'shared' : 'own',
    };

    // useCreate 훅 사용 (현재 폴더만 + defaultFolderId)
    const { addLink, showLinkModal, openLinkModal, closeLinkModal, folders } = useCreate(
        [currentFolder], // 현재 폴더만
        userId,
        refetch,
        defaultFolderId // URL 파라미터로 받은 defaultFolderId
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
