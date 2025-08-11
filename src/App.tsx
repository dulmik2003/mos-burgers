import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { InventoryManagement } from './components/Inventory/InventoryManagement';
import { OrderManagement } from './components/Orders/OrderManagement';
import { CustomerManagement } from './components/Customers/CustomerManagement';
import { Reports } from './components/Reports/Reports';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;