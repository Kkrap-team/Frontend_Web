// // MainPage.jsx
// import React from 'react';
// import './MainPage.css';

// export default function MainPage() {
//   const surveyUrl = import.meta.env.VITE_SURVEY_URL;

//   const handleSurveyClick = () => {
//     window.open(surveyUrl, '_blank');
//   };

//   return (
//     <div className="MainPage">
//       {/* 가운데 정렬 컨테이너 */}
//       <div className="MainPage__inner">
//         <div className="MainPageHeader">
//           <button className="MainPageHeaderButton" onClick={handleSurveyClick}>
//             설문조사하고 커피 받기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import MyFoldersSection from '../../features/main/components/MyFoldersSection';
import './MainPage.css';
import ExploreSharedSection from '@/features/main/components/ExploreSharedSection';
import { useAuthStore } from '@/stores/authStore';

function MainPage() {
    const surveyUrl = import.meta.env.VITE_SURVEY_URL;
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    const handleSurveyClick = () => {
        window.open(surveyUrl, '_blank');
    };

    return (
        <div className="MainPage">
            {/* 설문조사 버튼 - 로그인 상태에 따라 다르게 표시 */}
            {isLoggedIn && (
                <div className="MainPageHeader">
                    <button className="MainPageHeaderButton" onClick={handleSurveyClick}>
                        설문조사하고 커피 받기
                    </button>
                </div>
            )}

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
