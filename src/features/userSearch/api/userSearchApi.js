import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

export async function searchUsers(keyword) {
    try {
        const response = await api.get(
            `/follows/search?nickname=${encodeURIComponent(keyword)}`
        );
        
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw new Error('사용자 검색 중 오류가 발생했습니다.');
    }
}