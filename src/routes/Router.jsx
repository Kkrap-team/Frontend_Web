import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/layout';
import MainPage from '../pages/MainPage/MainPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import Header from '../components/layout/Header';
// import ProfilePage from ''

function AppRouter() {
    return (
        <Router>
            <Header />
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
                    {/* <Route path="/profile" element= {<ProfilePage/> }/> */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default AppRouter;
