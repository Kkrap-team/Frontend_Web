import React from 'react';
import MyFoldersSection from '../../features/main/components/MyFoldersSection';
import './MainPage.css';
import ExploreSharedSection from '@/features/main/components/ExploreSharedSection';
import { useAuthStore } from '@/stores/authStore';

function MainPage() {
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    return (
        <div className="MainPage">
            {/* 나의 폴더 섹션 - 회원만 표시 */}
            <MyFoldersSection />

            {/* 섹션 구분선 - 회원일 때만 표시 */}
            {isLoggedIn && <div className="MainPageSectionDivider"></div>}

            {/* 폴더 둘러보기 섹션 - 모든 사용자에게 표시 */}
            <ExploreSharedSection />
        </div>
    );
}

export default MainPage;
