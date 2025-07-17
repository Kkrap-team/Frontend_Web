import axios from 'axios';

const url = import.meta.env.VITE_URL;

//폴더 권한 제어 목록 조회 (팔로우 목록 조회)
export const getFolderPermissionList = async (userId) => {
    const res = await axios.get(`${url}/follows/${userId}/following`);
    console.log('폴더 권한 제어 목록 데이터', res.data);
    return res.data;
};
