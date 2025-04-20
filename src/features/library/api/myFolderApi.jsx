import axios from "axios";


export const getMyFolders = async (userId) => {
    const res = await axios.get(`http://43.203.234.0:8080/folders/${userId}`);
    return res.data;
  };


  export const deleteMyFolder = async (folderId) => {
    const res = await axios.delete(`http://43.203.234.0:8080/folders/${folderId}`);
    return res.data;  
  };

  export const createMyFolder = async (data) => {
    const res = await axios.post('http://43.203.234.0:8080/folders', data);
    return res.data;
  };
  