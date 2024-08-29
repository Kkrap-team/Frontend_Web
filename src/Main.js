// Main.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router 라이브러리에서 필요한 모듈을 가져옵니다.
import App from './App'; // 기존 App 컴포넌트
import LoginRedirect from './LoginRedirect'; // 방금 만든 LoginRedirect 컴포넌트 import
import Home from './HomePage/Home'
import Myprofile from './MyProfile/Myprofile';
import { AuthProvider } from './AuthContext/AithContext'; // AuthProvider import


function Main() {
  return (
    <AuthProvider> {/* AuthProvider로 전체 애플리케이션 감싸기 */}
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* 기본 경로('/')로 App 컴포넌트 렌더링 */}
        <Route path="/login/success" element={<LoginRedirect />}/>  {/* 로그인 리다이렉트 경로 */}
        <Route path="/home" element={<Home />} /> {/* 홈 페이지 경로 */}
        <Route path="/myprofile" element={<Myprofile />} /> {/* 홈 페이지 경로 */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default Main;
