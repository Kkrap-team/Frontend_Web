import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

// 폴더 생성
export async function createMyFolder(data) {
    const res = await api.post(`${url}/folders/users/folders`, data);
    return res.data;
}

export async function createLink(data) {
    const res = await api.post(`${url}/links/users/links`, data);
    return res.data;
}
