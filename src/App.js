import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>일상 속 모든 것을<br /><span className="highlight">스크랩, 크크랩</span></h1>
        <div className="logo">
            <img src="/logo.png" alt="크크랩 로고" />
        </div>
        <button className="kakao-button">카카오톡 계정으로 시작하기</button>
      </div>
    </div>
  );
}

export default App;
