import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext/AithContext';
import './Home.css'; // Home 컴포넌트에 대한 스타일 import
import { useNavigate } from 'react-router-dom';

function Home(){
    const { userInfo } = useAuth();
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

    useEffect(()=> {


    }, [userInfo]);

    const handleProfileClick = () => {
      navigate('/myprofile'); // MyProfile 컴포넌트로 이동
    };

    return (
        <div className='Home'>
          {/* <button className="profile-button" onClick={handleProfileClick}>
            MyProfile
          </button> */}

          <img
            src={userInfo.profileImage} // 프로필 이미지 URL 사용
            alt=""
            className="profile-button"
            onClick={handleProfileClick} // 클릭 시 프로필 페이지로 이동
          />
          
          <div className="bottom-navigation">
              <button className="nav-button">
              <span role="img" aria-label="home">🏠</span>
              Home
              </button>
              <button className="nav-button">
              <span role="img" aria-label="folder">📁</span>
              폴더
              </button>
              <button className="nav-button">
              <span role="img" aria-label="friends">👥</span>
              친구
              </button>
              <button className="nav-button">
              <span role="img" aria-label="settings">⚙️</span>
              설정
              </button>
          </div>
        </div>
      );
}


export default Home;