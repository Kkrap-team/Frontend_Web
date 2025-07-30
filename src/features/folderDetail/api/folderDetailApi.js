import axios from 'axios';

const url = import.meta.env.VITE_URL;

// 폴더 상세 정보 및 링크 목록 조회 (하나의 API로 모든 정보 가져옴)
export const getFolderDetail = async (folderId) => {
    const res = await axios.get(`${url}/folders/me/folders/${folderId}/links`);
    console.log('폴더 상세 정보 및 링크 목록:', res.data);
    return res.data;
};

// 링크 제목 수정
export const updateLinkTitle = async (userId, linkId, linkName) => {
    const res = await axios.patch(`${url}/links/users/${userId}/links/title`, {
        linkId,
        linkName,
    });
    console.log('링크 제목 수정:', res.data);
    return res.data;
};

// 링크 삭제
export const deleteLink = async (userId, linkId, folderId, defaultFolderId) => {
    const res = await axios.delete(`${url}/links/users/${userId}/links`, {
        data: {
            defaultFoldersId: defaultFolderId,
            foldersId: folderId,
            linkId: [linkId],
        },
    });
    console.log('링크 삭제:', res.data);
    return res.data;
};

//링크 삭제
