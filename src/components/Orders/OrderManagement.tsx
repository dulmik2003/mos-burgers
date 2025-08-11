import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Customer, Order, OrderItem } from '../../types';
import { ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { generateReceipt } from '../../utils/receiptGenerator';

export function OrderManagement() {
  const { state, dispatch } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = state.foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = state.currentOrder.items.reduce((sum, item) => 
    sum + (item.foodItem.price * item.quantity), 0
  );

  const discountAmount = cartTotal * (state.currentOrder.discountPercentage / 100);
  const finalTotal = cartTotal - discountAmount;

  const addToCart = (foodItem: FoodItem) => {
    if (foodItem.quantity <= 0) {
      alert('Item is out of stock!');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { foodItem, quantity: 1 } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };

  const createOrder = () => {
    if (!selectedCustomer || state.currentOrder.items.length === 0) {
      alert('Please select a customer and add items to cart!');
      return;
    }

    const orderItems: OrderItem[] = state.currentOrder.items.map(item => ({
      foodItem: item.foodItem,
      quantity: item.quantity,
      subtotal: item.foodItem.price * item.quantity,
    }));

    const order: Order = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      customer: selectedCustomer,
      items: orderItems,
      subtotal: cartTotal,
      discountPercentage: state.currentOrder.discountPercentage,
      discountAmount,
      total: finalTotal,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Update customer total orders
    const updatedCustomer = {
      ...selectedCustomer,
      totalOrders: selectedCustomer.totalOrders + 1,
    };
    dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });

    // Update inventory quantities
    state.currentOrder.items.forEach(item => {
      const updatedItem = {
        ...item.foodItem,
        quantity: item.foodItem.quantity - item.quantity,
      };
      dispatch({ type: 'UPDATE_FOOD_ITEM', payload: updatedItem });
    });

    // Generate and download receipt
    generateReceipt(order);

    // Clear cart
    dispatch({ type: 'CLEAR_CART' });
    setSelectedCustomer(null);
    
    alert('Order completed successfully!');
  };

  const handleNewCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const customer: Customer = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      contactNumber: formData.get('contactNumber') as string,
      email: formData.get('email') as string || undefined,
      address: formData.get('address') as string || undefined,
      totalOrders: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CUSTOMER', payload: customer });
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isExpired = item.expirationDate && new Date(item.expirationDate) < new Date();
            
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg shadow-md p-4 border ${
                  isExpired ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <span className="text-xs text-gray-500">{item.category}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Code: {item.itemCode}</span>
                    <span className={`font-medium ${
                      item.quantity < 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Stock: {item.quantity}
                    </span>
                  </div>

                  {isExpired && (
                    <div className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                      EXPIRED
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-orange-600">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity <= 0 || isExpired}
                      className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart and Customer Selection */}
      <div className="space-y-6">
        {/* Customer Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          {selectedCustomer ? (
            <div className="space-y-2">
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-sm text-gray-600">{selectedCustomer.contactNumber}</div>
                <div className="text-xs text-gray-500">Orders: {selectedCustomer.totalOrders}</div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Change Customer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                onChange={(e) => {
                  const customer = state.customers.find(c => c.id === e.target.value);
                  setSelectedCustomer(customer || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Customer</option>
                {state.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.contactNumber}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Add New Customer
              </button>
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <ShoppingCartIcon className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold">Cart ({state.currentOrder.items.length})</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {state.currentOrder.items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Cart is empty</p>
            ) : (
              <>
                {state.currentOrder.items.map((item) => (
                  <div key={item.foodItem.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.foodItem.name}</div>
                      <div className="text-xs text-gray-600">Rs. {item.foodItem.price} each</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-green-600"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.foodItem.id })}
                        className="p-1 text-gray-600 hover:text-red-600 ml-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Discount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={state.currentOrder.discountPercentage}
                    onChange={(e) => dispatch({ 
                      type: 'SET_DISCOUNT', 
                      payload: parseFloat(e.target.value) || 0 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Order Summary */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  {state.currentOrder.discountPercentage > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount ({state.currentOrder.discountPercentage}%):</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={createOrder}
                  disabled={!selectedCustomer || state.currentOrder.items.length === 0}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  Complete Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Add New Customer</h3>
            <form onSubmit={handleNewCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}