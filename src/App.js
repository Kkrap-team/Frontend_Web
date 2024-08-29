import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    nickname: '',
    profileImage: '',
    email: '',
  });

  useEffect(() => {
    // 로그인 성공 후 현재 페이지가 login/success인지 확인
    const currentURL = window.location.href;
    if (currentURL.includes('/login/success')) {
      // 쿠키에서 값 가져오기
      const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      };

      // 쿠키 값 가져오기
      const id = getCookieValue('id');
      const nickname = getCookieValue('nickname');
      const profileImage = getCookieValue('profileImage');
      const email = getCookieValue('email');

      if (id && nickname && profileImage && email) {
        setIsLoggedIn(true);
        setUserInfo({ id, nickname, profileImage, email });
        console.log('사용자 정보가 쿠키에서 성공적으로 로드되었습니다.');
      } else {
        console.log("로그인 정보가 없습니다.");
      }
    }
  }, []);

  const handleKakaoLogin = () => {
    // 백엔드로 리다이렉트하여 카카오 로그인을 시작
    window.location.href = 'http://172.20.10.12:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="App">
      <div className="container">
        <h1>일상 속 모든 것을<br /><span className="highlight">스크랩, 크크랩</span></h1>
        <div className="logo">
          <img src="/logo.png" alt="크크랩 로고" />
        </div>
        {isLoggedIn ? (
          <div>
            <p>환영합니다, {userInfo.nickname}님!</p>
            <img src={userInfo.profileImage} alt="프로필 이미지" />
            <p>Email: {userInfo.email}</p>
          </div>
        ) : (
          <button className="kakao-button" onClick={handleKakaoLogin}>
            카카오톡 계정으로 시작하기
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
