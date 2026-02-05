
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT',
  NGO = 'NGO',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN',
  ANIMAL_SHELTER = 'ANIMAL_SHELTER',
  ORPHANAGE = 'ORPHANAGE',
  OLD_AGE_HOME = 'OLD_AGE_HOME',
  REHAB_CENTER = 'REHAB_CENTER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ecoScore: number;
  badges: string[];
  location?: { lat: number; lng: number; address: string };
  joinedAt: Date;
  phoneNumber?: string;
  organizationName?: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  isSurplus: boolean; // If true, price is 0 or discounted significantly for NGOs
  imageUrl: string;
  quantity: number;
  expiryTime?: string;
  discount?: number; // Percentage discount for eco-friendly orders
}

export enum OrderStatus {
  PENDING = 'PENDING', // Waiting for driver
  ACCEPTED = 'ACCEPTED', // Driver assigned
  PICKED_UP = 'PICKED_UP', // Driver has food
  DELIVERED = 'DELIVERED', // Handed over
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  REGULAR = 'REGULAR',
  DONATION = 'DONATION',
}

export interface Order {
  id: string;
  customerId: string; // Or NGO ID
  restaurantId: string;
  items: FoodItem[];
  totalAmount: number;
  status: OrderStatus;
  type: OrderType;
  deliveryPartnerId?: string;
  qrCodeValue: string;
  createdAt: Date;
  deliveryAddress: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
