import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { AuthContext } from '@/contexts/AuthContext';
import { loginRoute } from '@/routes/Router';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const KAKAO_TOKEN_URL = import.meta.env.VITE_KAKAO_TOKEN_URL;
const url = import.meta.env.VITE_URL;

const useKakaoLogin = () => {
    const search = useSearch({ from: loginRoute.id });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const login = useRef(new Set());

    useEffect(() => {
        const code = search.code;
        // code가 있고, 중복 실행이 아니면 실행
        if (code && !login.current.has(code)) {
            login.current.add(code); // 중복 방지용

            const fetchToken = async () => {
                try {
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

                    const accessToken = tokenRes.data.access_token;

                    const user = await axios.post(`${url}/api/auth/kakao-login`, {
                        accesstoken: accessToken,
                    });
                    setUser(user.data);
                    console.log('setUser에 저장된 유저 데이터', user.data);
                    navigate({ to: '/' });
                } catch (err) {
                    console.error('카카오 로그인 실패:', err);
                    navigate({ to: '/login' }); // 로그인 실패 시 로그인 페이지로 리다이렉트
                }
            };

            fetchToken();
        }
    }, [search, setUser, navigate]);
};

export default useKakaoLogin;
