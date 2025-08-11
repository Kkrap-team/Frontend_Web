import React from 'react';
import MyFoldersSection from '../../features/main/components/MyFoldersSection';
import '../../features/main/styles/MainPage.css';
import './MainPage.css';
import ExploreSharedSection from '@/features/main/components/ExploreSharedSection';

function MainPage() {
    return (
        <div className="MainPage">
            <MyFoldersSection />
            <div className="MainPageSectionDivider"></div>
            <ExploreSharedSection />
        </div>
    );
}

export default MainPage;
