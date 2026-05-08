export type UserRole = 'owner' | 'renter' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: number;
}

export interface ParkingListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'garage' | 'private_spot' | 'reserved_space' | 'garden_spot' | 'toll_badge';
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  isNegotiable: boolean;
  images: string[];
  features: string[];
  isAvailable: boolean;
  qrCode?: string;
  pinCode?: string;
  createdAt: number;
  route?: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  };
}

export interface Booking {
  id: string;
  listingId: string;
  renterId: string;
  ownerId: string;
  startDate: number;
  endDate: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: number;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  createdAt: number;
}
