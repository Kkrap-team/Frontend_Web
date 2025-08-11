import axios from 'axios';

const url = import.meta.env.VITE_URL;

// 최신 공개 폴더 추천 피드: 스크롤 조회
export const fetchRecommendedScroll = async (userId) => {
    const res = await axios.get(`${url}/folders/users/${userId}/scroll`, {
        // 200(데이터) 또는 204(init 필요) 모두 허용
        validateStatus: (status) => [200, 204].includes(status),
    });
    console.log('스크롤', res);
    return { status: res.status, data: res.data };
};

// 추천 피드 초기화: Redis에 리스트/커서 생성
// 백엔드 스펙: GET /scroll-init (405는 메서드 불일치)
export const initRecommendedScroll = async (userId) => {
    const res = await axios.get(`${url}/folders/users/${userId}/scroll-init`, {
        validateStatus: (status) => status >= 200 && status < 300,
    });
    console.log('스크롤-init', res);
    return res.data;
};
