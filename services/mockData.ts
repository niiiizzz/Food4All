
import { FoodItem, Order, OrderStatus, OrderType, User, UserRole } from "../types";

export const MOCK_USERS: User[] = [
  // Admin Accounts
  { id: 'admin1', name: 'Govt Admin', email: 'govt@admin.in', role: UserRole.ADMIN, ecoScore: 0, badges: [], joinedAt: new Date('2022-01-01'), organizationName: 'Government of India', phoneNumber: '999-999-9999' },
  { id: 'admin2', name: 'DFPD Official', email: 'dfpd.govt@admin.in', role: UserRole.ADMIN, ecoScore: 0, badges: [], joinedAt: new Date('2022-01-01'), organizationName: 'DFPD', phoneNumber: '888-888-8888' },
  { id: 'admin3', name: 'FAO Rep', email: 'fao.un@admin.in', role: UserRole.ADMIN, ecoScore: 0, badges: [], joinedAt: new Date('2022-01-01'), organizationName: 'FAO UN', phoneNumber: '777-777-7777' },

  // Fresh Dummy Profiles (Clean Slate, No Password)
  { id: 'cust_1', name: 'Alice Citizen', email: 'alice@test.com', role: UserRole.CUSTOMER, ecoScore: 0, badges: [], joinedAt: new Date(), location: { lat: 0, lng: 0, address: '101 Maple Street' } },
  { id: 'rest_1', name: 'Urban Spice', email: 'rest@test.com', role: UserRole.RESTAURANT, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'Urban Spice Hotel', location: { lat: 0, lng: 0, address: 'Downtown Blvd' } },
  { id: 'ngo_1', name: 'Food For All NGO', email: 'help@test.com', role: UserRole.NGO, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'Food For All Foundation', location: { lat: 0, lng: 0, address: 'Charity Lane' } },
  { id: 'del_1', name: 'Rapid Riders', email: 'rider@test.com', role: UserRole.DELIVERY, ecoScore: 0, badges: [], joinedAt: new Date(), location: { lat: 0, lng: 0, address: 'Logistics Park' } },
  
  // Specialized Institutions
  { id: 'shelter_1', name: 'Happy Paws', email: 'contact@happypaws.org', role: UserRole.ANIMAL_SHELTER, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'Happy Paws Shelter' },
  { id: 'orph_1', name: 'Little Angels', email: 'admin@littleangels.org', role: UserRole.ORPHANAGE, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'Little Angels Orphanage' },
  { id: 'old_1', name: 'Sunset Care', email: 'info@sunsetcare.org', role: UserRole.OLD_AGE_HOME, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'Sunset Care Home' },
  { id: 'rehab_1', name: 'New Dawn', email: 'help@newdawn.org', role: UserRole.REHAB_CENTER, ecoScore: 0, badges: [], joinedAt: new Date(), organizationName: 'New Dawn Rehab Center' },
];

// Start with empty food and orders to ensure a clean slate
export const MOCK_FOOD: FoodItem[] = [];
export const MOCK_ORDERS: Order[] = [];
