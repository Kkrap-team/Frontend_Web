import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext/AithContext'; 


function LoginRedirect() {
  const navigate = useNavigate();
  const { setUserInfo } = useAuth(); // 사용자 정보를 업데이트할 수 있는 setUserInfo 가져오기

  useEffect(() => {
    // 쿠키 값 가져오기 함수
    const getCookieValues = () => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {});

      console.log('쿠키 값:', cookies); // 콘솔에 쿠키 값 출력
      return cookies;
    };

    const cookieValues = getCookieValues();
    if (cookieValues){
      const { id, nickname, profileImage, email } = cookieValues;

      if (id && nickname && profileImage && email) 
      {
        console.log('로그인 성공:', { id, nickname, profileImage, email });

        // 전역 상태에 사용자 정보 저장
        setUserInfo({ id, nickname, profileImage, email });

        navigate('/home'); // 홈 페이지로 이동
      } else {
        console.log('로그인 정보가 없습니다.');
      }
    }
    else 
      console.log('인증 코드 또는 상태 정보가 없습니다.');
    
  }, [navigate, setUserInfo]);

  return (
    <div>
      <p>로그인 중입니다...</p>
    </div>
  );
}

export default LoginRedirect;
