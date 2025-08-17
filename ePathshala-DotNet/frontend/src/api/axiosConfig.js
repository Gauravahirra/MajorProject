import axios from 'axios';

// Create a preconfigured axios instance.  Update the baseURL to
// match your backend API URL.  During development the backend
// typically runs on http://localhost:5000.
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});



// Attach JWT token to outgoing requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // adjust as needed
// });

// // Attach JWT token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
