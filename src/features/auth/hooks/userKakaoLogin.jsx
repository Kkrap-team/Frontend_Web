import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const useKakaoLogin = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const login = useRef(new Set());

    useEffect(() => {
        const code = searchParams.get('code');

        // code가 있고, 중복 실행이 아니면 실행
        if (code && !login.current.has(code)) {
            login.current.add(code); // 중복 방지용

            const fetchToken = async () => {
                try {
                    const tokenRes = await axios.post(
                        'https://kauth.kakao.com/oauth/token',
                        new URLSearchParams({
                            grant_type: 'authorization_code',
                            client_id: REST_API_KEY,
                            redirect_uri: REDIRECT_URI,
                            code: code,
                            client_secret: CLIENT_SECRET,
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );

                    const accessToken = tokenRes.data.access_token;
                    console.log('액세스 토큰', accessToken);

                    const user = await axios.post('http://43.203.234.0:8080/api/auth/kakao-login', {
                        accesstoken: accessToken,
                    });
                    setUser(user.data);
                    console.log('setUser에 저장된 유저 데이터', user.data);
                    navigate('/');
                } catch (err) {
                    console.error('카카오 로그인 실패:', err);
                }
            };

            fetchToken();
        }
    }, [location, setUser, navigate]);
};

export default useKakaoLogin;
