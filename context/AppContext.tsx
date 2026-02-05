
import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, FoodItem, Order, OrderStatus, OrderType, Notification } from '../types';
import { MOCK_USERS, MOCK_FOOD, MOCK_ORDERS } from '../services/mockData';

interface LoginParams {
  email: string;
  password?: string;
  role: UserRole;
  name?: string;
  phone?: string;
  address?: string;
  orgName?: string;
  isSignup?: boolean;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  foodItems: FoodItem[];
  orders: Order[];
  notifications: Notification[];
  login: (params: LoginParams) => boolean;
  logout: () => void;
  addFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driverId: string) => void;
  donateFood: (item: FoodItem, quantity: number) => void;
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_CREDENTIALS: Record<string, string> = {
  'govt@admin.in': '132007',
  'dfpd.govt@admin.in': 'Food4All',
  'fao.un@admin.in': 'FAO-UN'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(MOCK_FOOD);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (userId: string, message: string) => {
    const notif: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      userId,
      message,
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const login = ({ email, password, role, name, phone, address, orgName, isSignup }: LoginParams): boolean => {
    // Admin Security Check
    if (role === UserRole.ADMIN) {
      if (ADMIN_CREDENTIALS[email] && ADMIN_CREDENTIALS[email] === password) {
         const adminUser = users.find(u => u.email === email && u.role === UserRole.ADMIN);
         if (adminUser) {
             setCurrentUser(adminUser);
             return true;
         }
      }
      alert("Invalid Admin Credentials. Restricted Access.");
      return false;
    }

    if (isSignup) {
        // Registration Logic
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert("User already exists with this email.");
            return false;
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: name || email.split('@')[0],
            email,
            role,
            ecoScore: 0,
            badges: ['Newcomer'],
            joinedAt: new Date(),
            phoneNumber: phone,
            organizationName: orgName,
            location: address ? { lat: 0, lng: 0, address } : undefined
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return true;
    } else {
        // Regular Login Logic (Mock)
        // In a real app, we would check password here. 
        // For mock/dummy users, we skip password check if it's one of our dummy profiles.
        const user = users.find(u => u.email === email && u.role === role);
        if (user) {
            setCurrentUser(user);
            return true;
        } else {
            alert("User not found. Please Sign Up.");
            return false;
        }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addFoodItem = (item: FoodItem) => {
    setFoodItems(prev => [...prev, item]);
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== id);
        return newItems;
    });
    // Notify implicitly
    console.log(`Deleted food item ${id}`);
  };

  const placeOrder = (order: Order) => {
    // 1. Add the order to the order list
    setOrders(prev => [order, ...prev]);
    
    // 2. Update Inventory (Decrease Quantity)
    // Note: 'order.items' contains clones of food items where 'quantity' is the ORDERED amount
    setFoodItems(currentItems => 
      currentItems.map(item => {
        const orderedVersion = order.items.find(oi => oi.id === item.id);
        if (orderedVersion) {
            // Decrease stock by the ordered amount
            const newQuantity = Math.max(0, item.quantity - orderedVersion.quantity);
            return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // 3. Gamification Logic
    if (order.type === OrderType.DONATION && currentUser) {
        const points = 50;
        const updatedUser = { ...currentUser, ecoScore: currentUser.ecoScore + points };
        
        if (updatedUser.ecoScore > 100 && !updatedUser.badges.includes('Eco Warrior')) {
            updatedUser.badges.push('Eco Warrior');
            addNotification(currentUser.id, 'You earned the Eco Warrior badge!');
        }
        
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }

    addNotification(order.customerId, `Order placed successfully! ID: ${order.id}`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const msg = `Order #${order.id.slice(-4)} status: ${status}`;
        addNotification(order.customerId, msg);
        if (order.deliveryPartnerId) addNotification(order.deliveryPartnerId, msg);
        addNotification(order.restaurantId, msg);
    }
  };

  const assignDriver = (orderId: string, driverId: string) => {
     setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.ACCEPTED, deliveryPartnerId: driverId } : o));
  };

  const donateFood = (item: FoodItem, quantity: number) => {
    const surplusItem = { ...item, id: Date.now().toString(), isSurplus: true, price: 0, quantity };
    setFoodItems(prev => [...prev, surplusItem]);
    if (currentUser) {
        const updatedUser = { ...currentUser, ecoScore: currentUser.ecoScore + (quantity * 10) };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const deleteUser = (userId: string) => {
      setUsers(prevUsers => {
          const newUsers = prevUsers.filter(u => u.id !== userId);
          return newUsers;
      });
      console.log(`Deleted user ${userId}`);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, users, foodItems, orders, notifications,
      login, logout, addFoodItem, deleteFoodItem, placeOrder, updateOrderStatus, assignDriver, donateFood, deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
