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
    // 쿠키에서 값 가져오기
    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    // 쿠키에 저장된 로그인 정보 확인
    const id = getCookieValue('id');
    const nickname = getCookieValue('nickname');
    const profileImage = getCookieValue('profileImage');
    const email = getCookieValue('email');

    if (id && nickname && profileImage && email) {
      setIsLoggedIn(true);
      setUserInfo({ id, nickname, profileImage, email });
    } else {
      console.log("로그인 정보가 없습니다.");
    }
  }, []);

  const handleKakaoLogin = () => {
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
