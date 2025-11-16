import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

function getAccessToken() {
  return localStorage.getItem('access');
}
function getRefreshToken() {
  return localStorage.getItem('refresh');
}
export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}
export function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const r = await axios.post(`${BASE_URL}/api/auth/refresh/`, { refresh });
          setTokens({ access: r.data.access });
          original.headers.Authorization = `Bearer ${r.data.access}`;
          return api(original);
        } catch {
          clearTokens();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  login: (username, password) =>
    axios.post(`${BASE_URL}/api/auth/login/`, { username, password }),
};

// Produtos
export const productService = {
  getAll: () => api.get('/products/'),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
};