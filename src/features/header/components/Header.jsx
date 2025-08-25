import React, { useEffect, useState } from 'react';
import '../styles/Header.css';

import NavMenu from '../components/NavMenu';
import LoginMenu from '../components/LoginMenu';
import SearchOverlay from '../../search/components/SearchOverlay';
import useSearchToggle from '../hooks/useSearchToggle';
import Logo from '@/features/header/components/logo';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function Header() {
  const { showSearchInput, toggleSearch } = useSearchToggle();
  const isMobile = useIsMobile();

  // 페이지 맨 위에서만 상단 미니바 노출
  const [showTopBar, setShowTopBar] = useState(true);
  useEffect(() => {
    const onScroll = () => setShowTopBar(window.scrollY < 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {isMobile && (
        <div className={`MobileTopBar ${showTopBar ? 'show' : 'hide'}`}>
          <div className="MobileTopLeft"><Logo /></div>
          <div className="MobileTopRight"><LoginMenu /></div>
        </div>
      )}

      <header className="Header">
        <Logo />
        <NavMenu toggleSearch={toggleSearch} showSearchInput={showSearchInput} />
        <LoginMenu />
      </header>

      <SearchOverlay isVisible={showSearchInput} onClose={toggleSearch} />
    </>
  );
}


// import React from 'react';
// import '../styles/Header.css';

// import NavMenu from '../components/NavMenu';
// import LoginMenu from '../components/LoginMenu';
// import SearchOverlay from '../../search/components/SearchOverlay';
// import useSearchToggle from '../hooks/useSearchToggle';
// import Logo from '@/features/header/components/logo';

// export default function Header() {
//     const { showSearchInput, toggleSearch } = useSearchToggle();

//     return (
//         <>
//             <header className="Header">
//                 <Logo />
//                 <NavMenu toggleSearch={toggleSearch} showSearchInput={showSearchInput} />
//                 <LoginMenu />
//             </header>
//             <SearchOverlay isVisible={showSearchInput} onClose={toggleSearch} />
//         </>
//     );
// }