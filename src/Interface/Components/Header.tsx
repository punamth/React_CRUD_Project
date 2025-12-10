import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current page title if not provided
  const getCurrentPageTitle = () => {
    if (title) return title;
    
    const navigation = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Products', href: '/products' },
      { name: 'Add Product', href: '/products/add' },
      { name: 'Categories', href: '/categories' },
      { name: 'Add Category', href: '/categories/add' },
      { name: 'Groups', href: '/groups' },
      { name: 'Add Group', href: '/groups/add' },
    ];
    
    const currentNav = navigation.find(item => item.href === location.pathname);
    return currentNav ? currentNav.name : 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500">{user?.username || 'User'}</p>
            </div>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
