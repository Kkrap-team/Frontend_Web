import React from 'react';
import MyFoldersSection from '../../features/main/components/MyFoldersSection';
import '../../features/main/styles/MainPage.css';
import './MainPage.css';
import ExploreSharedSection from '@/features/main/components/ExploreSharedSection';

function MainPage() {
    const surveyUrl = import.meta.env.VITE_SURVEY_URL;

    const handleSurveyClick = () => {
        window.open(surveyUrl, '_blank');
    };

    return (
        <div className="MainPage">
            <div className="MainPageHeader">
                <button className="MainPageHeaderButton" onClick={handleSurveyClick}>
                    설문조사하고 커피 받기
                </button>
            </div>
            <MyFoldersSection />
            <div className="MainPageSectionDivider"></div>
            <ExploreSharedSection />
        </div>
    );
}

export default MainPage;
