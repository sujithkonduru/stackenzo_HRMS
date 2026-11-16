import api from './axiosInstance'
const m = (v: string | undefined, d: string) => (v || d).toLowerCase() as any
const MS = m(import.meta.env.VITE_MILESTONE_CREATE_METHOD, 'post')
const CL = m(import.meta.env.VITE_CHECKLIST_CREATE_METHOD, 'post')
const AS = m(import.meta.env.VITE_ASSIGN_ITEMS_METHOD, 'post')
export const authApi = { login: (b: any) => api.post('/api/user/login', b).then(r => r.data) }
export const dashboardApi = { get: () => api.get('/api/user/dashboard').then(r => r.data) }
export const projectApi = { create: (b: any) => api.post('/api/projects/create', b).then(r => r.data) }
export const milestoneApi = {
  list: (pid: string) => api.get(`/api/milestones/${pid}`).then(r => r.data),
  create: (pid: string, b: any) => api.request({ method: MS, url: `/api/milestones/${pid}`, data: b }).then(r => r.data),
  assignItems: (mid: string, item_ids: string[]) => api.request({ method: AS, url: `/api/milestones/${mid}/assign-items`, data: { item_ids } }).then(r => r.data),
}
export const checklistApi = {
  create: (pid: string, b: any) => api.request({ method: CL, url: `/api/milestones/${pid}/items`, data: b }).then(r => r.data),
  timeline: (pid: string) => api.get(`/api/checklist/${pid}/timeline`).then(r => r.data),
}
export const taskApi = {
  createBulk: (tasks: any[]) => api.post('/api/task/create-bulk', { tasks }).then(r => r.data),
  all: (params: any) => api.get('/api/task/all', { params }).then(r => r.data),
}
