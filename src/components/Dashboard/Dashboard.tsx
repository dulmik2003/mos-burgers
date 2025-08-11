import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const { stats, state } = useApp();

  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
      change: '+8%'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Food Items',
      value: stats.totalItems.toString(),
      icon: CubeIcon,
      color: 'bg-orange-500',
      change: '+3%'
    },
  ];

  const expiredItems = state.foodItems.filter(item => 
    item.expirationDate && new Date(item.expirationDate) < new Date()
  );

  const lowStockItems = state.foodItems.filter(item => item.quantity < 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(expiredItems.length > 0 || lowStockItems.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expired Items Alert */}
          {expiredItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">Expired Items</h3>
                  <p className="text-sm text-red-600 mt-1">
                    {expiredItems.length} items have expired and need immediate attention.
                  </p>
                  <ul className="mt-3 space-y-1">
                    {expiredItems.slice(0, 3).map((item) => (
                      <li key={item.id} className="text-sm text-red-700">
                        • {item.name} (Code: {item.itemCode})
                      </li>
                    ))}
                    {expiredItems.length > 3 && (
                      <li className="text-sm text-red-700">
                        • And {expiredItems.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">Low Stock Items</h3>
                  <p className="text-sm text-yellow-600 mt-1">
                    {lowStockItems.length} items are running low on stock.
                  </p>
                  <ul className="mt-3 space-y-1">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <li key={item.id} className="text-sm text-yellow-700">
                        • {item.name} ({item.quantity} left)
                      </li>
                    ))}
                    {lowStockItems.length > 3 && (
                      <li className="text-sm text-yellow-700">
                        • And {lowStockItems.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="p-6">
          {state.orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet. Start creating orders!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {state.orders.slice(-5).reverse().map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 font-medium">#{order.id.slice(-6)}</td>
                      <td className="py-3">{order.customer.name}</td>
                      <td className="py-3">{order.items.length} items</td>
                      <td className="py-3 font-medium">Rs. {order.total.toLocaleString()}</td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}