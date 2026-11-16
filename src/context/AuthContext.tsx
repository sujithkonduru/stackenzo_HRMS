import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, dashboardApi } from '../api'
import { TOKEN_KEY } from '../api/axiosInstance'
const Ctx = createContext<any>(null)
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }: any) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [dash, setDash] = useState<any>(null)
  const [loading, setLoading] = useState(!!token)
  const [mustChange, setMustChange] = useState(false)
  const logout = useCallback(() => { localStorage.removeItem(TOKEN_KEY); setToken(null); setDash(null) }, [])
  const refresh = useCallback(async () => { const d = await dashboardApi.get(); setDash(d); return d }, [])
  useEffect(() => { window.addEventListener('hrms-expired', logout); return () => window.removeEventListener('hrms-expired', logout) }, [logout])
  useEffect(() => { if (token) { setLoading(true); refresh().catch(() => {}).finally(() => setLoading(false)) } }, [token])
  const login = async (email: string, password: string) => {
    const r = await authApi.login({ email, password })
    localStorage.setItem(TOKEN_KEY, r.token); setMustChange(!!r.user?.must_change_password); setToken(r.token)
  }
  const role = dash?.user?.role
  return <Ctx.Provider value={{ token, dash, user: dash?.user, role, isAdmin: role === 'SUPER_ADMIN' || role === 'ADMIN', loading, login, logout, refresh, mustChange }}>{children}</Ctx.Provider>
}
