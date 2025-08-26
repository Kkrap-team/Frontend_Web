import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

// 최신 공개 폴더 추천 피드: 스크롤 조회 (회원용)
export const fetchRecommendedScroll = async () => {
    const res = await api.get(`${url}/folders/users/scroll`, {
        // 200(데이터) 또는 204(init 필요) 모두 허용
        validateStatus: (status) => [200, 204].includes(status),
    });
    console.log('스크롤', res);
    return { status: res.status, data: res.data };
};

// 추천 피드 초기화: Redis에 리스트/커서 생성 (회원용)
// 백엔드 스펙: GET /scroll-init (405는 메서드 불일치)
export const initRecommendedScroll = async () => {
    const res = await api.get(`${url}/folders/users/scroll-init`, {
        validateStatus: (status) => status >= 200 && status < 300,
    });
    console.log('스크롤-init', res);
    return res.data;
};

// 비회원용 메인 페이지 폴더 조회 (일부만)
export const fetchNoAuthMainFolders = async () => {
    const res = await api.get(`${url}/folders-search/noauth/main`);
    console.log('비회원 메인 폴더', res);
    return res.data;
};

// 폴더 스크랩 (회원만 가능)
export const scrapFolder = async (scrapData) => {
    const res = await api.post(`${url}/folders/users/scrap`, scrapData);
    console.log('폴더 스크랩 결과:', res.data);
    return res.data;
};
