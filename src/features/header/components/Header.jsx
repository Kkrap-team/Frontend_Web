import React from 'react';
import '../styles/Header.css';

import NavMenu from '../components/NavMenu';
import LoginMenu from '../components/LoginMenu';
import SearchOverlay from '../../search/components/SearchOverlay';
import useSearchToggle from '../hooks/useSearchToggle';
import Logo from '@/features/header/components/logo';

export default function Header() {
    const { showSearchInput, toggleSearch } = useSearchToggle();

    return (
        <>
            <header className="header">
                <Logo/>
                <NavMenu toggleSearch={toggleSearch} showSearchInput={showSearchInput} />
                <LoginMenu />
            </header>
            <SearchOverlay isVisible={showSearchInput} onClose={toggleSearch} />
        </>
    );
}
