import axios from 'axios';

const url = import.meta.env.VITE_URL;

// 폴더 생성
export async function createMyFolder(data) {
    console.log('api요청부분입니다이 ', data);
    await axios.post(`${url}/folders/users/${data.userId}/folders`, data);
}
