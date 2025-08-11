import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
    timeout: 10000,
    withCredentials: true, // TODO: 배포 전 쿠키 기반으로 전환 (현재는 refresh에 미사용)
});

// refreshToken 요청용 별도 axios 인스턴스 (interceptor 없음)
const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_URL,
    timeout: 10000,
    withCredentials: true,
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue = [];

// 대기 중인 요청들 처리
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().getAccessToken();
        if (!accessToken) {
            // 중요: 토큰이 없으면 인증이 필요한 API 호출은 실패 가능
            // 여기서는 단순 통과하고, 서버 401에서 재발급/로그아웃 흐름 처리
        }
        console.log('요청 URL:', config.url);
        console.log('요청 메서드:', config.method);
        console.log('현재 AccessToken:', accessToken);
        console.log('요청 헤더:', config.headers);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('Authorization 헤더 추가됨:', `Bearer ${accessToken}`);
        } else {
            console.log('AccessToken이 없어서 Authorization 헤더를 추가하지 않음');
        }
        return config;
    },
    (error) => {
        console.error('요청 에러:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 401 에러 시 토큰 자동 갱신
api.interceptors.response.use(
    (response) => {
        console.log('응답 성공:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        const status = error.response ? error.response.status : null;
        const reqUrl = error.config ? error.config.url : 'unknown';
        console.error('응답 에러:', status, reqUrl);

        const originalRequest = error.config;

        // 401 에러이고 아직 재시도하지 않았다면
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // refreshToken 요청 자체는 재시도하지 않음
            //todo : 컨펌모달 추가, 메인페이지로 이동 추가 해야함
            if (originalRequest.url === '/api/auth/refresh') {
                console.log('refreshToken 요청이 401 에러, 로그아웃 처리');
                useAuthStore.getState().logout();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            // 이미 토큰 갱신 중이면 대기
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;

            try {
                // TODO: 배포 전 쿠키 기반으로 전환
                // 임시: 로컬 저장된 refreshToken으로 갱신 (도메인 상이로 쿠키 미사용)
                const storedRefreshToken = useAuthStore.getState().getRefreshToken();

                if (!storedRefreshToken) {
                    console.warn('저장된 refreshToken 없음 → 로그아웃 처리');
                    useAuthStore.getState().logout();
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }

                // TODO: 배포 전 쿠키 기반으로 전환
                // 임시: 로컬 저장된 refreshToken을 요청 본문으로 전달 (CORS 문제 해결)

                const response = await axios.post(
                    `${import.meta.env.VITE_URL}/api/auth/refresh`,
                    {
                        refreshToken: storedRefreshToken,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // 새로운 토큰 저장 (서버가 refreshToken 재발급 시 교체)
                useAuthStore.getState().setTokens(accessToken, newRefreshToken ?? storedRefreshToken);

                // 대기 중인 요청들 처리
                processQueue(null, accessToken);

                console.log('토큰 갱신 성공');

                // 새로운 토큰으로 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);

                // 대기 중인 요청들 처리
                processQueue(refreshError, null);

                // 로그아웃
                useAuthStore.getState().logout();

                // 로그인 페이지로 리다이렉트
                //todo : 컨펌모달 추가, 메인페이지로 이동 추가 해야함
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
