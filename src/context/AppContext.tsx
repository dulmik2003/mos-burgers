import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FoodItem, Customer, Order, DashboardStats } from '../types';

interface AppState {
  foodItems: FoodItem[];
  customers: Customer[];
  orders: Order[];
  currentOrder: {
    items: { foodItem: FoodItem; quantity: number }[];
    discountPercentage: number;
  };
}

type AppAction =
  | { type: 'ADD_FOOD_ITEM'; payload: FoodItem }
  | { type: 'UPDATE_FOOD_ITEM'; payload: FoodItem }
  | { type: 'DELETE_FOOD_ITEM'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { foodItem: FoodItem; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  foodItems: [],
  customers: [],
  orders: [],
  currentOrder: {
    items: [],
    discountPercentage: 0,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  stats: DashboardStats;
}>({
  state: initialState,
  dispatch: () => {},
  stats: { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalItems: 0, expiredItems: 0 },
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_FOOD_ITEM':
      return { ...state, foodItems: [...state.foodItems, action.payload] };
    case 'UPDATE_FOOD_ITEM':
      return {
        ...state,
        foodItems: state.foodItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_FOOD_ITEM':
      return {
        ...state,
        foodItems: state.foodItems.filter(item => item.id !== action.payload),
      };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
      };
    case 'ADD_TO_CART':
      const existingItem = state.currentOrder.items.find(
        item => item.foodItem.id === action.payload.foodItem.id
      );
      if (existingItem) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map(item =>
              item.foodItem.id === action.payload.foodItem.id
                ? { ...item, quantity: item.quantity + action.payload.quantity }
                : item
            ),
          },
        };
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: [...state.currentOrder.items, action.payload],
        },
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.filter(item => item.foodItem.id !== action.payload),
        },
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.map(item =>
            item.foodItem.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    case 'SET_DISCOUNT':
      return {
        ...state,
        currentOrder: { ...state.currentOrder, discountPercentage: action.payload },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        currentOrder: { items: [], discountPercentage: 0 },
      };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalRevenue: state.orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: state.orders.length,
    totalCustomers: state.customers.length,
    totalItems: state.foodItems.length,
    expiredItems: state.foodItems.filter(item => 
      item.expirationDate && new Date(item.expirationDate) < new Date()
    ).length,
  };

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('mosb-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleData = {
        foodItems: [
          {
            id: '1',
            name: 'Classic Beef Burger',
            category: 'Burgers',
            price: 850,
            quantity: 25,
            itemCode: 'BB001',
            expirationDate: '2025-02-15',
          },
          {
            id: '2',
            name: 'Chicken Submarine',
            category: 'Submarines',
            price: 750,
            quantity: 15,
            itemCode: 'CS001',
            expirationDate: '2025-02-10',
          },
          {
            id: '3',
            name: 'Coca Cola',
            category: 'Beverages',
            price: 200,
            quantity: 50,
            itemCode: 'CC001',
            expirationDate: '2025-06-30',
          },
        ] as FoodItem[],
        customers: [
          {
            id: '1',
            name: 'John Doe',
            contactNumber: '0771234567',
            email: 'john@email.com',
            address: '123 Main St, Colombo',
            totalOrders: 5,
            createdAt: '2025-01-01',
          },
        ] as Customer[],
        orders: [] as Order[],
      };
      dispatch({ type: 'LOAD_DATA', payload: sampleData });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mosb-data', JSON.stringify({
      foodItems: state.foodItems,
      customers: state.customers,
      orders: state.orders,
    }));
  }, [state.foodItems, state.customers, state.orders]);

  return (
    <AppContext.Provider value={{ state, dispatch, stats }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);