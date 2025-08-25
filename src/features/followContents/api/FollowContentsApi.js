import api from '@/utils/axiosConfig';
const url = import.meta.env.VITE_URL;
export async function getFollowContents() {
    try {
        const response = await api.get(`${url}/activityfeed/feed`);
        console.log('팔로우 컨텐츠 데이터:', response.data);
        return response.data;
    } catch (error) {
        console.error('팔로우 컨텐츠 API 오류:', error);
        throw new Error('팔로우 컨텐츠를 불러오는 중 오류가 발생했습니다.');
    }
}
