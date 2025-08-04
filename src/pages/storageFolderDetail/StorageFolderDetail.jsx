import React from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import useFolderDetail from '@/features/folderDetail/hooks/useFolderDetail';
import FolderHeader from '@/features/folderDetail/components/FolderHeader';
import LinkList from '@/features/folderDetail/components/LinkList';

const routeApi = getRouteApi('/storage/$folderId');

export default function StorageFolderDetail() {
    // Route API 방식으로 파라미터 추출
    const { folderId } = routeApi.useParams();

    // 사용자 정보 가져오기
    const { user } = useContext(AuthContext);
    const userId = user?.userId;

    // 폴더 상세 정보 및 링크 목록 조회
    const { folderInfo, links, loading, error, refetch } = useFolderDetail(folderId);

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
        </div>
    );
}
