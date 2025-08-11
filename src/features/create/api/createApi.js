import axios from 'axios';
import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

// 폴더 생성
export async function createMyFolder(data) {
    console.log('api요청부분입니다이 ', data);
    await api.post(`${url}/folders/users/folders`, data);
}

export async function createLink(data) {
    console.log('링크 생성 api요청부분입니다이 ', data);
    await api.post(`${url}/links/users/links`, data);
}
