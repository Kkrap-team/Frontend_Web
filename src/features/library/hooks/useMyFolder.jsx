
import { useEffect, useState } from 'react';
import { getMyFolders, deleteMyFolder, createMyFolder } from '../api/myFolderApi';

export default function useMyFolders(userId) {
  const [folders, setFolders] = useState([]);

  const fetchFolders = async () => {
    if (!userId) return;
    try {
      const data = await getMyFolders(userId);
      setFolders(data);
    } catch (err) {
      console.error('폴더 get 안됨 :', err);
    }
  };

  // 폴더 삭제
  const removeFolder = async (folderId) => {
    try {
      await deleteMyFolder(folderId);
      fetchFolders();
    } catch (err) {
      console.error('폴더 delete 안됨 :', err);
    }
  };

  //폴더 생성
  const addFolder = async (data) =>{
    try {
      await createMyFolder(data);
      fetchFolders();
    }catch (err){
      console.error('폴더 create 안됨 :', err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [userId]);

  return { folders, removeFolder, addFolder };
}
