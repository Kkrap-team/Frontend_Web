import React from 'react';
import MyFolderCard from '@/features/storage/components/MyFolderCard';
import styles from '../styles/SortedResultsSection.module.css';

const SortedRankingSection = ({ rankings, loading }) => {

    // 랭킹 카드에서는 메뉴 기능을 사용하지 않으므로 빈 함수로 정의
    const handleDelete = () => {};
    const handleEdit = () => {};
    const handlePermission = () => {};

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

    // API 응답 데이터 넣기.
    const scrapData = rankings?.topscrapCount || [];
    const viewData = rankings?.topViewCount || [];

    // rankings가 객체인 경우 배열로 변환
    const viewDataArray = Array.isArray(viewData) ? viewData : Object.values(viewData || {});
    const scrapDataArray = Array.isArray(scrapData) ? scrapData : Object.values(scrapData || {});

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
                    {viewDataArray?.slice(0, 10)
                      .filter(item => {
                        // folderId가 undefined, null이 아니고, 숫자 타입인 경우 유효
                        const isValid = item.folderId !== undefined && item.folderId !== null && typeof item.folderId === 'number';
                        return isValid;
                      })
                      .map((item, index) => {
                        // folder 객체 생성 전 로그
                        const folderObj = {
                          folderId: item.folderId, // API 응답의 folderId 사용
                          folderName: item.folderName || `폴더 ${index + 1}`,
                          folderDescription: item.folderDescription || '설명이 없습니다.',
                          links: item.thumbnailUrl ? [{ thumbnailUrl: item.thumbnailUrl }] : 
                                 item.faviconUrl ? [{ faviconUrl: item.faviconUrl }] : [],
                          scrapCount: item.scrapCount || 0,
                          viewCount: item.viewCount || 0,
                          visible: item.visible || true,
                          userId: item.userId // 폴더 소유자의 userId 추가
                        };
                        
                        return (
                          <div key={item.folderId} className={styles.RankingCardGridItem}>
                            <MyFolderCard
                              folder={folderObj}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              onPermission={handlePermission}
                              showMenu={false}
                              allFolders={[]}
                            />
                          </div>
                        );
                      })}
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
                    {scrapDataArray?.slice(0, 10)
                      .filter(item => {
                        // folderId가 undefined, null이 아니고, 숫자 타입인 경우 유효
                        const isValid = item.folderId !== undefined && item.folderId !== null && typeof item.folderId === 'number';
                        return isValid;
                      })
                      .map((item, index) => {
                        // folder 객체 생성 전 로그
                        const folderObj = {
                          folderId: item.folderId, // API 응답의 folderId 사용
                          folderName: item.folderName || `폴더 ${index + 1}`,
                          folderDescription: item.folderDescription || '설명이 없습니다.',
                          links: item.thumbnailUrl ? [{ thumbnailUrl: item.thumbnailUrl }] : 
                                 item.faviconUrl ? [{ faviconUrl: item.faviconUrl }] : [],
                          scrapCount: item.scrapCount || 0,
                          viewCount: item.viewCount || 0,
                          visible: item.visible || true,
                          userId: item.userId // 폴더 소유자의 userId 추가
                        };
                        
                        return (
                          <div key={item.folderId} className={styles.RankingCardGridItem}>
                            <MyFolderCard
                              folder={folderObj}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              onPermission={handlePermission}
                              showMenu={false}
                              allFolders={[]}
                            />
                          </div>
                        );
                      })}
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

export default SortedRankingSection;
