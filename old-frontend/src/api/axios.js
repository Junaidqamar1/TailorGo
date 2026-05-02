import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

// Attach access token to every request
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token expired → use refresh token to get new one
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken')
      const { data } = await axios.post('/api/auth/refresh', { refresh })
      sessionStorage.setItem('accessToken', data.accessToken)
      err.config.headers.Authorization = `Bearer ${data.accessToken}`
      return axios(err.config) // retry original request
    }
    return Promise.reject(err)
  }
)

export default api