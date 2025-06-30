import axios from 'axios';

export const fetchFollowingList = async (userId) => {
  const response = await axios.get(`http://3.39.86.218:8080/follows/${userId}/following`);
  return response.data;
};

