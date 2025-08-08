import React from 'react';
import MyFoldersSection from '../../features/main/components/MyFoldersSection';
import '../../features/main/styles/MainPage.css';
import { useAuth } from '@/contexts/AuthContext';
import './MainPage.css';

function MainPage() {
    const { user } = useAuth();

    return (
        <div className="MainPage">
            <MyFoldersSection />

            {/* 추천 콘텐츠 섹션 */}
            <div className="ContentSection">
                <div className="ContentHeader">
                    <h2 className="ContentTitle">추천 콘텐츠</h2>
                    <div className="SortOptions">
                        <span className="SortOption active">최신순</span>
                        <span className="SortOption">인기순</span>
                    </div>
                </div>
                <div className="ContentGrid">{/* 추천 콘텐츠 카드들 */}</div>
            </div>
        </div>
    );
}

export default MainPage;
