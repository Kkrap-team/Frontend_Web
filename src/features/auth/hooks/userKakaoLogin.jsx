import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const useKakaoLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (code) {
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
                    console.log('유저', user);

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
