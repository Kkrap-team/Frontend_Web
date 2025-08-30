import api from '@/utils/axiosConfig';
import axios from 'axios';

const url = import.meta.env.VITE_URL;

export const searchFolders = async (query) => {
    try {
        const response = await axios.get(`${url}/folders-search/noauth/text?keyword=${encodeURIComponent(query)}`);
       
        // 응답이 배열이 아닌 경우 빈 배열 반환
        if (!Array.isArray(response.data)) {
    
            return [];
        }
        
        return response.data;
    } catch (error) {
        console.error('검색 API 오류:', error);
        console.error('오류 응답:', error.response?.data);
        throw error;
    }
};

// 새로운 엔드포인트를 사용하는 검색 함수
export const searchFoldersByEnter = async (query) => {
    try {
        const response = await axios.get(`${url}/folders-search/noauth/enter?keyword=${encodeURIComponent(query)}`);

        // 응답이 배열이 아닌 경우 빈 배열 반환
        if (!Array.isArray(response.data)) {
        
            return [];
        }
        
        return response.data;
    } catch (error) {
        console.error('Enter 검색 API 오류:', error);
        console.error('오류 응답:', error.response?.data);
        throw error;
    }
};

export const getRankings = async () => {
    try {
        const response = await axios.get(`${url}/folders-search/noauth/rankings`);

        return response.data;
    } catch (error) {
        console.error('랭킹 API 오류:', error);
        throw error;
    }
}; 