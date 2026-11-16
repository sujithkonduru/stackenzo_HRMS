import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
export default function App() {
  const { token, loading, isAdmin, dash } = useAuth()
  if (!token) return <Routes><Route path="*" element={<Login />} /></Routes>
  if (loading && !dash) return <Spinner />
  return <Routes><Route element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="employees" element={isAdmin ? <Employees /> : <Navigate to="/" />} />
    <Route path="projects" element={<Projects />} />
    <Route path="projects/:id" element={<ProjectDetails />} />
    <Route path="tasks" element={<Tasks />} />
    <Route path="profile" element={<Profile />} />
    <Route path="*" element={<Navigate to="/" />} /></Route></Routes>
}
