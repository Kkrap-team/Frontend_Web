import React, { useState } from 'react';
import '@/features/create/styles/CreateDropdown.css';

export default function CreateDropdown({ onCreateFolder, onAddLink }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <button className="CreateButton" onClick={() => setShowMenu((prev) => !prev)}>
                <img className="CreateButtonImg" src="/create_folder.png" alt="폴더 생성" />
            </button>
            {showMenu && (
                <div className="CreateDropdownMenu" onMouseLeave={() => setShowMenu(false)}>
                    <button
                        onClick={() => {
                            onCreateFolder();
                            setShowMenu(false);
                        }}
                    >
                        폴더 생성하기
                    </button>
                    <button
                        onClick={() => {
                            onAddLink();
                            setShowMenu(false);
                        }}
                    >
                        링크 추가하기
                    </button>
                </div>
            )}
        </>
    );
}
