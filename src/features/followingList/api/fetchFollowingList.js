import axios from 'axios';
const url = import.meta.env.VITE_URL;

export const fetchFollowingList = async (userId) => {
  const response = await axios.get(`${url}/follows/${userId}/following`);
  return response.data;
};

