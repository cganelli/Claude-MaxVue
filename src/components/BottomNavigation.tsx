import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, MoreHorizontal } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/homepage'  // Changed from '/welcome' to '/homepage'
    },
    {
      id: 'rx',
      label: 'Rx',
      icon: FileText,
      path: '/home'  // This links to the main dashboard
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/more'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/homepage') {
      return location.pathname === '/homepage';
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-[60px] ${
                active 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;