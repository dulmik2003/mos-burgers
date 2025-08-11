import React from 'react';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon,
  UserGroupIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'inventory', name: 'Store Management', icon: ShoppingBagIcon },
  { id: 'orders', name: 'Order Management', icon: ShoppingCartIcon },
  { id: 'customers', name: 'Customer Management', icon: UserGroupIcon },
  { id: 'reports', name: 'Reports', icon: DocumentChartBarIcon },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-orange-600">MOS Burgers</h1>
        <p className="text-sm text-gray-500 mt-1">Management System</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                activeTab === item.id 
                  ? 'bg-orange-50 border-r-2 border-orange-500 text-orange-600' 
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}