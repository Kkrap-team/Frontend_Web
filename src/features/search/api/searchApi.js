import axios from 'axios';

const url = import.meta.env.VITE_URL;

export const searchFolders = async (query) => {
    try {
        const response = await axios.get(`${url}/folders-search/search?keyword=${encodeURIComponent(query)}`);

        console.log('검색 API 응답 상태:', response.status);
        console.log('검색 API 응답 데이터:', response.data);
        return response.data;
    } catch (error) {
        console.error('검색 API 오류:', error);
        throw error;
    }
}; 