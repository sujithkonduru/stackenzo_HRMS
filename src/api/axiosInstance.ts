import axios from 'axios'
export const TOKEN_KEY = 'hrms_token'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 20000 })
api.interceptors.request.use(c => { const t = localStorage.getItem(TOKEN_KEY); if (t) c.headers.Authorization = `Bearer ${t}`; return c })
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401 && !e.config.url.includes('/user/login')) { localStorage.removeItem(TOKEN_KEY); window.dispatchEvent(new Event('hrms-expired')) }
  e.friendly = e.response?.data?.message || (e.request && !e.response ? 'Cannot reach the server. Check your connection and that Tailscale is on.' : e.message)
  return Promise.reject(e)
})
export const errMsg = (e: any) => e?.friendly || 'Something went wrong'
export default api
