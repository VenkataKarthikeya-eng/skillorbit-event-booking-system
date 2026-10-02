import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.', 'Signed Out');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span>SkillOrbit Events</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/events" className={navLinkClass}>Browse Events</NavLink>

            {isAuthenticated && !isAdmin && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    Dashboard
                  </span>
                </NavLink>
                <NavLink to="/my-bookings" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <Ticket className="w-4 h-4 text-slate-500" />
                    My Bookings
                  </span>
                </NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    Admin Panel
                  </span>
                </NavLink>
                <NavLink to="/admin/events" className={navLinkClass}>Manage Events</NavLink>
                <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase text-slate-500">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">Home</NavLink>
          <NavLink to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">Browse Events</NavLink>

          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">Dashboard</NavLink>
              <NavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">My Bookings</NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50 font-semibold">Admin Dashboard</NavLink>
              <NavLink to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">Manage Events</NavLink>
              <NavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100">My Bookings</NavLink>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3">
                  <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg text-sm">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
