import axios from 'axios';

const url = import.meta.env.VITE_URL;

//폴더 권한 제어 목록 조회 (팔로우 목록 조회)
export const getFolderPermissionList = async (userId) => {
    const res = await axios.get(`${url}/follows/${userId}/following`);
    console.log('폴더 권한 제어 목록 데이터', res.data);
    return res.data;
};

//폴더 권한 부여 (폴더 공유)
export const grantFolderPermission = async (userId, folderId, invitedUserIds) => {
    console.log('폴더 권한 부여 데이터', userId, folderId, invitedUserIds);
    const res = await axios.post(`${url}/folderspermissions/${userId}/share`, {
        folderId: folderId,
        invitedUserIds: invitedUserIds,
    });
    console.log('폴더 권한 부여 성공:', res.data);
    return res.data;
};
