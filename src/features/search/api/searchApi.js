import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

export const searchFolders = async (query) => {
    try {
        console.log('검색 요청:', query);
        const response = await api.get(`${url}/folders-search/search/text?keyword=${encodeURIComponent(query)}`);

        console.log('검색 API 응답 상태:', response.status);
        console.log('검색 API 응답 데이터:', response.data);
        console.log('검색 결과 타입:', typeof response.data);
        console.log('검색 결과 길이:', Array.isArray(response.data) ? response.data.length : '배열 아님');
        
        // 응답이 배열이 아닌 경우 빈 배열 반환
        if (!Array.isArray(response.data)) {
            console.log('응답이 배열이 아니므로 빈 배열 반환');
            return [];
        }
        
        return response.data;
    } catch (error) {
        console.error('검색 API 오류:', error);
        console.error('오류 응답:', error.response?.data);
        throw error;
    }
};

export const getRankings = async () => {
    try {
        const response = await api.get(`${url}/folders-search/rankings`);

        console.log('랭킹 API 응답 상태:', response.status);
        console.log('랭킹 API 응답 데이터:', response.data);
        return response.data;
    } catch (error) {
        console.error('랭킹 API 오류:', error);
        throw error;
    }
}; 