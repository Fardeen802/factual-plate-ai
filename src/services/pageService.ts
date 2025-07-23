import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/pages';

export const createPage = async (content: object) => {
  const res = await axios.post(API_BASE, { content });
  return res.data;
};

export const getPage = async (id: string) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const updatePage = async (id: string, content: object) => {
  const res = await axios.put(`${API_BASE}/${id}`, { content });
  return res.data;
};

export const deletePage = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}; 