import React from 'react';
import styles from '../styles/followerSearchBar.module.css';

const FollowerSearchBar = ({ searchText, onChange}) => {

    return(
        <div>
            <input
                type="text"
                className={styles.searchInput}
                placeholder='팔로워 검색'
                value={searchText}
                onDurationChangeCapture={(e) => onChange(e.target.value)}
            />
        </div>


    );

}

export default FollowerSearchBar;