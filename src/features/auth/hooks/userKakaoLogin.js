import { useEffect, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { loginRoute } from '@/routes/Router';
import api from '@/utils/axiosConfig';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const KAKAO_TOKEN_URL = import.meta.env.VITE_KAKAO_TOKEN_URL;
const url = import.meta.env.VITE_URL;

const useKakaoLogin = () => {
    const search = useSearch({ from: loginRoute.id });
    const navigate = useNavigate();
    const { setUser, setTokens } = useAuthStore();
    const login = useRef(new Set());

    useEffect(() => {
        const code = search.code;
        // code가 있고, 중복 실행이 아니면 실행
        if (code && !login.current.has(code)) {
            login.current.add(code);

            const fetchToken = async () => {
                try {
                    // 카카오에서 액세스 토큰 받기
                    const tokenRes = await axios.post(
                        KAKAO_TOKEN_URL,
                        new URLSearchParams({
                            grant_type: 'authorization_code',
                            client_id: REST_API_KEY,
                            redirect_uri: REDIRECT_URI,
                            code: search.code,
                            client_secret: CLIENT_SECRET,
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );

                    const kakaoAccessToken = tokenRes.data.access_token;

                    // TODO: 배포 전 쿠키 기반으로 전환
                    // 임시: 도메인 상이로 쿠키 미전송 → 응답의 refreshToken을 로컬에 저장
                    const response = await api.post(
                      `${url}/api/auth/kakao-login`,
                      { accesstoken: kakaoAccessToken },
                    );

                    const { token, profile } = response.data;

                    // 임시: refreshToken도 로컬에 저장해 사용 (쿠키 전환 시 null로 변경)
                    const accessToken =
                      token && token.accessToken
                        ? token.accessToken
                        : token && token.access_token
                        ? token.access_token
                        : null;
                    const refreshToken =
                      token && token.refreshToken
                        ? token.refreshToken
                        : token && token.refresh_token
                        ? token.refresh_token
                        : null;
                    setTokens(accessToken, refreshToken);
                    setUser(profile);

                    // 저장 후 확인
                    console.log('저장 후 localStorage 확인:');
                    console.log('userProfile:', localStorage.getItem('userProfile'));
                    console.log('token:', localStorage.getItem('token'));

                    console.log('로그인 성공:', response.data);
                    navigate({ to: '/' });
                } catch (err) {
                    console.error('카카오 로그인 실패:', err);
                    navigate({ to: '/login' }); // 로그인 실패 시 로그인 페이지로 리다이렉트
                }
            };

            fetchToken();
        }
    }, [search, setUser, setTokens, navigate]);
};

export default useKakaoLogin;
