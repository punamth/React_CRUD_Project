import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { 
      name: 'Products', 
      href: '/products', 
      icon: '📦',
      subItems: [
        { name: 'View All Products', href: '/products' },
        { name: 'Add New Product', href: '/products/add' }
      ]
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: '📁',
      subItems: [
        { name: 'View Categories', href: '/categories' },
        { name: 'Add Category', href: '/categories/add' }
      ]
    },
    { 
      name: 'Product Groups', 
      href: '/groups', 
      icon: '📋',
      subItems: [
        { name: 'View Groups', href: '/groups' },
        { name: 'Add Group', href: '/groups/add' }
      ]
    },
    { name: 'Orders', href: '/orders', icon: '🛒' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Reports', href: '/reports', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-black border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const expanded = isExpanded(item.name);
              
              return (
                <div key={item.name}>
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                  
                  {/* Sub Items */}
                  {hasSubItems && expanded && (
                    <div className="ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-4 py-2 text-xs font-medium rounded transition-all duration-200 ${
                              isSubActive
                                ? 'bg-slate-600 text-white'
                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 