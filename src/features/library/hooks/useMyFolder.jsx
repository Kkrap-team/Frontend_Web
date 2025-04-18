import { useState, useEffect } from "react";
import { getMyFolders } from "../api/myFolderApi";

export default function useMyFolders(userId) {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchFolders = async () => {
      const data = await getMyFolders(userId);
      setFolders(data);
      console.log(data);
    };

    fetchFolders();
  }, [userId]);

  return { folders };
}
