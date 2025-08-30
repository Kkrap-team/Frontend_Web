import api from '@/utils/axiosConfig';
const url = import.meta.env.VITE_URL;

//폴더 권한 제어 목록 조회 (팔로우 목록 조회)
export const getFolderPermissionList = async (folderId) => {
    const res = await api.get(`${url}/folderspermissions/folders/${folderId}/candidates`);

    return res.data;
};

//폴더 권한 부여 (폴더 공유)
export const grantFolderPermission = async (userId, folderId, invitedUserIds) => {
    const res = await api.post(`${url}/folderspermissions/share`, {
        folderId: folderId,
        invitedUserIds: invitedUserIds,
    });
   return res.data;
};

//폴더 권한 삭제 (폴더 공유 취소)
export const revokeFolderPermission = async (userId, folderId, invitedUserId) => {
   const res = await api.delete(`${url}/folderspermissions/share`, {
        data: {
            folderId: folderId,
            invitedUserId: invitedUserId,
        },
    });
    return res.data;
};
