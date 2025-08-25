import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

// 폴더 상세 정보 및 전체 링크 목록 조회
export const getFolderDetail = async (folderId, targetUserId) => {
    const res = await api.get(`${url}/folders/users/${folderId}/links/${targetUserId}`);
    console.log('폴더 상세 정보 및 링크 목록:', res.data);
    return res.data;
};

// 링크 제목 수정
export const updateLinkTitle = async (linkId, linkName) => {
    const res = await api.patch(`${url}/links/users/links/title`, {
        linkId,
        linkName,
    });
    console.log('링크 제목 수정:', res.data);
    return res.data;
};

// 링크 삭제
export const deleteLink = async (linkId, folderId) => {
    const res = await api.delete(`${url}/links/users/links`, {
        data: {
            foldersId: folderId,
            linkId: [linkId],
        },
    });
    console.log('링크 삭제:', res.data);
    return res.data;
};

// 링크 이동
export const moveLink = async ({ linkId, sourceFolderId, targetFolderId }) => {
    console.log('링크 이동:', linkId, sourceFolderId, targetFolderId);
    const res = await api.patch(`${url}/links/users/links/move`, {
        linkId,
        sourceFolderId,
        targetFolderId,
    });
    console.log('링크 이동:', res.data);
    return res.data;
};
