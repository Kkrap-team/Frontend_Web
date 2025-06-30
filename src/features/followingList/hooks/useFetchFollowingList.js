import {useState, useCallback} from 'react';
import { fetchFollowingList } from '../api/fetchFollowingList';

export const useFetchFollowingList = () => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadFollowers = useCallback(async (userId) => {
        setLoading(true);
        try {
            const data = await fetchFollowingList(userId);
            setFollowers(data);
        }catch (err){
            console.error('팔로우 리스트 가져오는 부분 오류 : useFetchFollowingList.js 확인 바람.',err);
        }finally{
            setLoading(false);
        }
    }, []);

    return{
        followers, loading, loadFollowers,
    };

};