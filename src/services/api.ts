import { UserProfile, ParkingListing, Booking, ChatMessage } from '@/src/types';

const API_BASE = '/api';

export const api = {
  // Auth
  async signup(data: any): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async login(data: any): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Listings
  async getListings(): Promise<ParkingListing[]> {
    const res = await fetch(`${API_BASE}/listings`);
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },

  async createListing(data: any): Promise<ParkingListing> {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create listing');
    return res.json();
  },

  // Bookings
  async getBookings(userId: string): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async createBooking(data: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },
};
