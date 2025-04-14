import { useState } from 'react';

const useSearchToggle = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const toggleSearch = () => setShowSearchInput(prev => !prev);
    return { showSearchInput, toggleSearch };
};

export default useSearchToggle;
