import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

//폴더 조회(내 폴더, 공유 폴더)
export const getMyFolders = async (targetUserId) => {
    const res = await api.get(`${url}/folders/users/thumbnails/${targetUserId}`);
   
    return res.data;
};

//axios에서 delete 요청 시 백엔드에서 body로 요청했기 때문에 data라는 객체 안에 config인 folderId를 넣어줘야 함
export const deleteMyFolder = async (folderId) => {
    const res = await api.delete(`${url}/folders/users/folders`, { data: { folderId } });
    return res.data;
};

//폴더 헤더 조회
//재윤이 백엔드 스펙이 {userId}를 필요로 해서 추가
export const getMyFolderProfile = async (userId) => {
    const res = await api.get(`${url}/users/folders/${userId}`);
    return res.data;
};

//폴더 수정
export const editMyFolder = async (data) => {
    const res = await api.patch(`${url}/folders/${data.folderId}`, data);
    return res.data;
};
