
import api from '@/utils/axiosConfig';
const url = import.meta.env.VITE_URL;

export const fetchFollowingList = async () => {
  const response = await api.get(`${url}/follows/following`);
  return response.data;
};

