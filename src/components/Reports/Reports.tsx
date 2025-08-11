import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

export function Reports() {
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Monthly Sales Report
  const monthlyReport = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = endOfMonth(startDate);
    
    const monthlyOrders = state.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isWithinInterval(orderDate, { start: startDate, end: endDate });
    });

    const totalRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = monthlyOrders.length;
    
    // Group by food items
    const itemsSold = monthlyOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        const key = item.foodItem.name;
        if (!acc[key]) {
          acc[key] = { quantity: 0, revenue: 0 };
        }
        acc[key].quantity += item.quantity;
        acc[key].revenue += item.subtotal;
      });
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);

    return {
      totalRevenue,
      totalOrders,
      itemsSold: Object.entries(itemsSold)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
    };
  }, [state.orders, selectedMonth, selectedYear]);

  // Top Customers Report
  const topCustomers = useMemo(() => {
    const customerStats = state.customers.map(customer => {
      const customerOrders = state.orders.filter(order => order.customerId === customer.id);
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        ...customer,
        totalSpent,
        orderCount: customerOrders.length
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    return customerStats.slice(0, 10);
  }, [state.customers, state.orders]);

  // Annual Report
  const annualReport = useMemo(() => {
    const startDate = startOfYear(new Date(selectedYear, 0, 1));
    const endDate = endOfYear(new Date(selectedYear, 11, 31));
    
    const yearlyOrders = state.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isWithinInterval(orderDate, { start: startDate, end: endDate });
    });

    const totalRevenue = yearlyOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = yearlyOrders.length;
    
    // Monthly breakdown
    const monthlyBreakdown = Array.from({ length: 12 }, (_, index) => {
      const monthStart = new Date(selectedYear, index, 1);
      const monthEnd = endOfMonth(monthStart);
      const monthOrders = yearlyOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
      });
      
      return {
        month: format(monthStart, 'MMM'),
        revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
        orders: monthOrders.length
      };
    });

    // Food items count
    const itemsCount = yearlyOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        const key = item.foodItem.name;
        acc[key] = (acc[key] || 0) + item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalOrders,
      monthlyBreakdown,
      itemsCount: Object.entries(itemsCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    };
  }, [state.orders, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {format(new Date(2024, i, 1), 'MMMM')}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Sales Report */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          Monthly Sales Report - {format(new Date(selectedYear, selectedMonth - 1, 1), 'MMMM yyyy')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">Total Revenue</h4>
            <p className="text-2xl font-bold text-green-600">
              Rs. {monthlyReport.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">Total Orders</h4>
            <p className="text-2xl font-bold text-blue-600">
              {monthlyReport.totalOrders}
            </p>
          </div>
        </div>

        {monthlyReport.itemsSold.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Top Selling Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Quantity Sold</th>
                    <th className="pb-2">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyReport.itemsSold.slice(0, 10).map((item) => (
                    <tr key={item.name}>
                      <td className="py-2 font-medium">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">Rs. {item.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Top Customers</h3>
        
        {topCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Contact</th>
                  <th className="pb-2">Total Orders</th>
                  <th className="pb-2">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td className="py-2">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        {customer.name}
                      </div>
                    </td>
                    <td className="py-2">{customer.contactNumber}</td>
                    <td className="py-2">{customer.orderCount}</td>
                    <td className="py-2 font-medium">Rs. {customer.totalSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No customer data available.</p>
        )}
      </div>

      {/* Annual Report */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Annual Report - {selectedYear}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800">Annual Revenue</h4>
            <p className="text-2xl font-bold text-purple-600">
              Rs. {annualReport.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-800">Annual Orders</h4>
            <p className="text-2xl font-bold text-indigo-600">
              {annualReport.totalOrders}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Breakdown */}
          <div>
            <h4 className="font-medium mb-3">Monthly Breakdown</h4>
            <div className="space-y-2">
              {annualReport.monthlyBreakdown.map((month) => (
                <div key={month.month} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{month.month}</span>
                  <div className="text-right text-sm">
                    <div>{month.orders} orders</div>
                    <div className="font-medium">Rs. {month.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Items by Quantity */}
          <div>
            <h4 className="font-medium mb-3">Most Ordered Items</h4>
            <div className="space-y-2">
              {annualReport.itemsCount.slice(0, 10).map((item) => (
                <div key={item.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}