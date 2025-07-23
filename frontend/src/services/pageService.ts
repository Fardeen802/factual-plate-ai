import axios from 'axios';

const API_ROOT = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/api/pages`;



export const getPage = async (id: string) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const updatePage = async (id: string, content: object) => {
  const res = await axios.put(`${API_BASE}/${id}`, { content });
  return res.data;
};
