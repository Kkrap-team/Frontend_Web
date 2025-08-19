// src/features/folderDetail/components/SharedUsersPanel.jsx
import React from 'react';
import '../styles/SharedUsersPanel.css';

export default function SharedUsersPanel({ users = [], loading, onManage }) {
    const shown = users.slice(0, 3);
    const more = users.length - shown.length;
    return (
        <div className="SharedUsersPanel">
            <div className="SharedUsersLeft" onClick={onManage} role="button" tabIndex={0}>
                <div className="SharedUsersStack">
                    {(loading ? [0, 1, 2] : shown).map((u, i) => {
                        if (loading) return <span key={i} className="SharedUserSkeleton" />;
                        const key = u?.userId ?? u?.followingId ?? u?.id ?? i;
                        const src = u?.profileImage || u?.profile || u?.imageUrl || '/Kkrap_logo.png';
                        const alt = u?.nickname || 'user';
                        return (
                            <img
                                key={key}
                                className="SharedUserAvatar"
                                src={src}
                                alt={alt}
                                onError={(e) => (e.currentTarget.src = '/Kkrap_logo.png')}
                            />
                        );
                    })}
                </div>
                {more > 0 && <span className="SharedUsersMore">+{more}</span>}
            </div>
        </div>
    );
}
