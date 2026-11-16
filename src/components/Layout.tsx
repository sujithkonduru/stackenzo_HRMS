import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Users, FolderKanban, ListChecks, UserCircle, Menu, LogOut, Bell, Search, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './ui'
const nav = [{ to: '/', l: 'Dashboard', i: LayoutDashboard }, { to: '/employees', l: 'Employees', i: Users, admin: true }, { to: '/projects', l: 'Projects', i: FolderKanban }, { to: '/tasks', l: 'Tasks', i: ListChecks }, { to: '/profile', l: 'Profile', i: UserCircle }]
export default function Layout() {
  const { user, role, isAdmin, logout, dash } = useAuth(); const [open, setOpen] = useState(false); const go = useNavigate()
  const pending = dash?.summary?.pending ?? 0
  return <div className="flex min-h-screen">
    {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed z-40 h-full w-60 border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${open ? '' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center gap-2 px-2 text-lg font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"><Briefcase size={16} /></span>HRMS</div>
      <nav className="space-y-1">{nav.filter(n => !n.admin || isAdmin).map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setOpen(false)}
        className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-blue-50 to-white text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}><n.i size={18} />{n.l}</NavLink>)}</nav>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(true)}><Menu /></button>
        {isAdmin && <form className="relative hidden max-w-xs flex-1 sm:block" onSubmit={(e: any) => { e.preventDefault(); go(`/employees?q=${encodeURIComponent(e.target.q.value)}`) }}>
          <Search size={16} className="absolute left-3 top-3 text-slate-400" /><input name="q" placeholder="Search employees" className="w-full rounded-lg bg-slate-100 py-2 pl-9 pr-3 text-sm" /></form>}
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 md:block">{dash?.date || new Date().toLocaleDateString('en-GB')}</span>
          <button className="relative" aria-label="Pending tasks" onClick={() => go('/tasks')}><Bell size={20} />{pending > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">{pending}</span>}</button>
          <div className="flex items-center gap-2"><Avatar name={user?.full_name} /><div className="hidden text-xs leading-tight sm:block"><div className="font-semibold">{user?.full_name}</div><div className="text-slate-500">{String(role).replace('_', ' ')}</div></div></div>
          <button onClick={logout} aria-label="Log out" className="rounded p-2 hover:bg-slate-100"><LogOut size={18} /></button>
        </div></header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6"><Outlet /></main></div></div>
}
