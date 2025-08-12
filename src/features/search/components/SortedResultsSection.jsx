import React from 'react';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import styles from '../styles/SortedResultsSection.module.css';

const SortedResultsSection = ({ rankings, loading }) => {

    if (loading) {
        return (
            <div className={styles.sortedResultsSection}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>랭킹 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 데이터 구조 확인 및 디버깅
    console.log('SortedResultsSection rankings:', rankings);
    console.log('topViewCount:', rankings?.topViewCount);
    console.log('topscrapCount:', rankings?.topscrapCount);
    console.log('전체 rankings 키들:', rankings ? Object.keys(rankings) : 'rankings 없음');
    
    // API 응답 데이터 넣기.
    const scrapData = rankings?.topscrapCount || [];
    const viewData = rankings?.topViewCount || [];

    return (
        <div className={styles.sortedResultsSection}>
            <div className={styles.sortedSection}>
                <h3 className={styles.sortedTitle}>조회순 TOP 10</h3>
               
                
                {/* CSS Grid를 사용한 카드 배치 */}
                <div className={styles.cardGridContainer}>
                  <button 
                    className={styles.scrollButton} 
                    onClick={() => document.querySelector(`.${styles.cardGrid}`).scrollBy({ left: -300, behavior: 'smooth' })}
                    aria-label="왼쪽으로 스크롤"
                  >
                    ‹
                  </button>
                  
                  <div className={styles.cardGrid}>
                    {viewData?.slice(0, 10).map((item, index) => (
                      <div key={item.id || index} className={styles.RankingCardGridItem}>
                        <MyFolderCard
                          folder={{
                            folderId: item.id || `view-${index}`,
                            folderName: item.title || item.folderName || `폴더 ${index + 1}`,
                            folderDescription: item.description || item.folderDescription || '설명이 없습니다.',
                            links: item.imageUrl ? [{ thumbnailUrl: item.imageUrl }] : 
                                   item.thumbnailUrl ? [{ thumbnailUrl: item.thumbnailUrl }] :
                                   item.faviconUrl ? [{ faviconUrl: item.faviconUrl }] : [],
                            defaultFolder: false,
                            scrapCount: item.scrapCount || 0,
                            viewCount: item.viewCount || 0,
                            visible: true
                          }}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onPermission={handlePermission}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className={styles.scrollButton} 
                    onClick={() => document.querySelector(`.${styles.cardGrid}`).scrollBy({ left: 300, behavior: 'smooth' })}
                    aria-label="오른쪽으로 스크롤"
                  >
                    ›
                  </button>
                </div>
            </div>
            
            <div className={styles.sortedSection}>
                <h3 className={styles.sortedTitle}>스크랩 순 TOP 10</h3>
                
                {/* CSS Grid를 사용한 카드 배치 */}
                <div className={styles.cardGridContainer}>
                  <button 
                    className={styles.scrollButton} 
                    onClick={() => document.querySelectorAll(`.${styles.cardGrid}`)[1].scrollBy({ left: -300, behavior: 'smooth' })}
                    aria-label="왼쪽으로 스크롤"
                  >
                    ‹
                  </button>
                  
                  <div className={styles.cardGrid}>
                    {scrapData?.slice(0, 10).map((item, index) => (
                      <div key={item.id || index} className={styles.RankingCardGridItem}>
                        <MyFolderCard
                          folder={{
                            folderId: item.id || `scrap-${index}`,
                            folderName: item.title || item.folderName || `폴더 ${index + 1}`,
                            folderDescription: item.description || item.folderDescription || '설명이 없습니다.',
                            links: item.imageUrl ? [{ thumbnailUrl: item.imageUrl }] : 
                                   item.thumbnailUrl ? [{ thumbnailUrl: item.thumbnailUrl }] :
                                   item.faviconUrl ? [{ faviconUrl: item.faviconUrl }] : [],
                            defaultFolder: false,
                            scrapCount: item.scrapCount || 0,
                            viewCount: item.viewCount || 0,
                            visible: true
                          }}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onPermission={handlePermission}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className={styles.scrollButton} 
                    onClick={() => document.querySelectorAll(`.${styles.cardGrid}`)[1].scrollBy({ left: 300, behavior: 'smooth' })}
                    aria-label="오른쪽으로 스크롤"
                  >
                    ›
                  </button>
                </div>
            </div>
        </div>
    );
};

export default SortedResultsSection; 