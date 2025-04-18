import axios from "axios";


export const getMyFolders = async (userId) => {
    const res = await axios.get(`http://43.203.234.0:8080/folders/${userId}`);
    return res.data;
  };
