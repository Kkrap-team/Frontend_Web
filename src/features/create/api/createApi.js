import axios from 'axios';

const url = import.meta.env.VITE_URL;

// 폴더 생성
export async function createMyFolder(data, userId) {
    console.log('api요청부분입니다이 ', data);
    await axios.post(`${url}/folders/users/${userId}/folders`, data);
}

export async function createLink(data, userId) {
    console.log('링크 생성 api요청부분입니다이 ', data, userId);
    await axios.post(`${url}/links/users/${userId}/links`, data);
}
