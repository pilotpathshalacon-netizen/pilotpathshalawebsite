import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { unreadCount, loadNotifications } = useNotification();

  React.useEffect(() => {
    if (user?.id && token) {
      loadNotifications(user.id, token);
    }
  }, [user?.id, token, loadNotifications, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/my-learning', label: 'My Learning' },
    { path: '/tests', label: 'Tests' },
    // { path: '/notifications', label: 'Notifications' },
    { path: '/profile', label: 'Profile' },
    // { divider: true },
    // { path: '/daily-reminders', label: 'Daily Reminders' },
    // { path: '/exam-strategy', label: 'Exam Strategy' },
    // { path: '/offline-learning', label: 'Offline Learning' },
    // { path: '/settings', label: 'Settings' },
    { divider: true },
    { path: '/contact', label: 'Contact Us' },
    { path: '/about', label: 'About' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms-of-use', label: 'Terms of Use' }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 w-64 h-full bg-white border-r border-border transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary-900">Pilot Pathshala</h1>
            <p className="text-sm text-tertiary_text mt-1">Learning Platform</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-4 border-t border-gray-200" />;
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-900 text-white'
                      : 'text-primary_text hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            {user && (
              <div className="mb-4">
                <p className="font-semibold text-primary_text truncate">{user.name || user.email}</p>
                <p className="text-sm text-tertiary_text truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-primary_text hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-primary_text hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={22} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
