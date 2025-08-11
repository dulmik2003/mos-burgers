export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  expirationDate?: string;
  itemCode: string;
  discount?: number;
}

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  totalOrders: number;
  createdAt: string;
}

export interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalItems: number;
  expiredItems: number;
}