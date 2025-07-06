import axios from 'axios';

const url = import.meta.env.VITE_URL;

export const getMyFolders = async (userId) => {
    const res = await axios.get(`${url}/folders/users/${userId}/folders/thumbnails/me`);
    console.log('폴더 데이터', res.data);
    return res.data;
};

export const deleteMyFolder = async (userId, folderId) => {
    console.log('폴더 삭제 데이터', userId, folderId);
    const res = await axios.delete(`${url}/folders/users/${userId}/folders`, { data: { folderId } });
    return res.data;
};

// export const getFolderHeader = async (userId) => {
//     const res = await axios.get(`${url}/folders/users/${userId}/folders/header`);
//     console.log('폴더 헤더 데이터', res.data);
//     return res.data;
// };
