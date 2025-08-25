import React from 'react';
import '../styles/LinkCard.css';

const LinkCard = ({ link, onKebabClick }) => {
    const { linkUrl, linkName, thumbnailUrl, faviconUrl, createTime } = link;

    // 링크 클릭 핸들러
    const handleLinkClick = () => {
        window.open(linkUrl, '_blank');
    };

    // 대표 이미지 (썸네일 우선, 없으면 파비콘, 둘 다 없으면 기본 이미지)
    const displayImage = thumbnailUrl || faviconUrl || '/Kkrap_logo_large.png';

    return (
        <div className="LinkCard" onClick={handleLinkClick}>
            <div className="LinkCardImage">
                <img
                    src={displayImage}
                    alt={linkName || 'LinkThumbnail'}
                    onError={(e) => {
                        e.target.onError = null;
                        e.target.src = '/Kkrap_logo_large.png';
                    }}
                />
            </div>

            <div className="LinkCardContent">
                <div className="LinkCardHeader">
                    <h3 className="LinkCardTitle">{linkName || 'NoTitle'}</h3>
                    <button
                        className="LinkCardKebab"
                        onClick={(e) => {
                            e.stopPropagation();
                            onKebabClick(link);
                        }}
                    >
                        ⋮
                    </button>
                </div>

                <div className="LinkCardUrl">{linkUrl}</div>

                <div className="LinkCardDate">{createTime && new Date(createTime).toLocaleDateString()}</div>
            </div>
        </div>
    );
};

export default LinkCard;
