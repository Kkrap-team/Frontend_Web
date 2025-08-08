import axios from 'axios';
import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

//폴더 조회(내 폴더, 공유 폴더)
export const getMyFolders = async () => {
    const res = await api.get(`${url}/folders/users/folders/thumbnails/me`);
    console.log('폴더 조회 데이터', res.data);
    return res.data;
};

//axios에서 delete 요청 시 백엔드에서 body로 요청했기 때문에 data라는 객체 안에 config인 folderId를 넣어줘야 함
export const deleteMyFolder = async (userId, folderId) => {
    console.log('폴더 삭제 데이터', userId, folderId);
    const res = await api.delete(`${url}/folders/users/folders`, { data: { folderId } });
    return res.data;
};

//폴더 헤더 조회
export const getMyFolderProfile = async () => {
    const res = await api.get(`${url}/users/folders/`);
    console.log('폴더 헤더 조회 데이터', res.data);
    return res.data;
};

//폴더 수정
export const editMyFolder = async (data) => {
    console.log('폴더 수정 데이터', data);
    const res = await api.patch(`${url}/folders/${data.folderId}`, data);
    return res.data;
};
