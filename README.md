# MOS Burgers Management System

A comprehensive restaurant management system built with React, TypeScript, and Tailwind CSS. This MVP application helps streamline operations for MOS Burgers, a local burger shop, by digitizing order processing, inventory management, customer relations, and business reporting.

## 🍔 Features

### Store Management
- **Inventory Control**: Add, update, and delete food items with categories, prices, and quantities
- **Expiration Tracking**: Automatic notifications for expired items with removal capabilities
- **Stock Monitoring**: Low stock alerts and real-time inventory updates
- **Search & Filter**: Find items by name, code, or category

### Order Management
- **Interactive Menu**: Browse items by category with real-time availability
- **Smart Cart System**: Add items, adjust quantities, and apply discounts
- **Customer Integration**: Link orders to customer profiles
- **PDF Receipts**: Automatic receipt generation for completed orders
- **Order History**: View, search, and manage previous orders

### Customer Management
- **Customer Profiles**: Store contact details, addresses, and order history
- **Quick Registration**: Add customers during order process or separately
- **Order Tracking**: View all orders per customer with detailed breakdowns
- **Search Functionality**: Find customers by name, phone, or email

### Reports & Analytics
- **Dashboard Overview**: Real-time business metrics and alerts
- **Monthly Reports**: Sales performance and top-selling items
- **Annual Analytics**: Yearly revenue trends and customer insights
- **Top Customers**: Identify best customers by spending and frequency

## 🚀 Quick Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd mos-burgers-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will load with sample data ready to explore

### That's it! 🎉
The application comes pre-loaded with sample data including:
- Sample food items (burgers, submarines, beverages)
- A test customer profile
- Ready-to-use categories and pricing

## 📱 Usage Guide

### Getting Started
1. **Dashboard**: Overview of business metrics, alerts, and recent activity
2. **Store Management**: Manage your food inventory and pricing
3. **Order Management**: Process new orders and manage existing ones
4. **Customer Management**: Handle customer information and order history
5. **Reports**: Generate business insights and analytics

### Key Workflows

**Processing an Order:**
1. Go to Order Management
2. Select or add a customer
3. Add items to cart from the menu
4. Apply discounts if needed
5. Complete order to generate PDF receipt

**Managing Inventory:**
1. Go to Store Management
2. Add new items or update existing ones
3. Monitor expiration dates and stock levels
4. Remove expired items when prompted

**Viewing Reports:**
1. Go to Reports section
2. Select month/year for analysis
3. View sales performance and customer insights
4. Export data as needed

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Heroicons and Lucide React
- **PDF Generation**: jsPDF for receipts
- **Charts**: Chart.js with React wrapper
- **Date Handling**: date-fns for date operations
- **Build Tool**: Vite for fast development
- **Data Storage**: localStorage (easily replaceable with backend API)

## 📊 Sample Data

The application includes realistic sample data:
- **Food Items**: Classic Beef Burger, Chicken Submarine, Coca Cola
- **Categories**: Burgers, Submarines, Beverages
- **Customer**: John Doe with contact information
- **Pricing**: Realistic Sri Lankan Rupee pricing

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard/       # Dashboard and analytics
│   ├── Inventory/       # Store management
│   ├── Orders/          # Order processing
│   ├── Customers/       # Customer management
│   ├── Reports/         # Business reports
│   └── Layout/          # Navigation and layout
├── context/             # React Context for state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx             # Main application component
```

## 🚀 Future Enhancements

This MVP is designed to easily scale into a full MERN stack application:

### Backend Integration Ready
- Replace localStorage with MongoDB database
- Add Express.js API endpoints
- Implement user authentication
- Add real-time notifications

### Advanced Features
- Multi-location support
- Advanced reporting with charts
- SMS/Email notifications
- Online ordering system
- Payment gateway integration

## 📝 Business Context

**MOS Burgers** is a locally-owned medium-scale business serving 50-60 customers daily. This system replaces manual, paper-based processes with a modern digital solution for:
- Streamlined order processing
- Efficient inventory management
- Customer relationship management
- Business intelligence and reporting

## 🤝 Contributing

This is an MVP designed for demonstration and learning. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational and demonstration purposes.

---

**Ready to revolutionize your restaurant operations?** 🍔✨

Start the development server and explore all features with the pre-loaded sample data!