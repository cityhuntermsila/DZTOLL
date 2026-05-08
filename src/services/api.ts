import { UserProfile, ParkingListing, Booking, ChatMessage } from '@/src/types';

const API_BASE = '/api';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error [${res.status}]:`, errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || `Request failed with status ${res.status}`);
    } catch (e) {
      throw new Error(errorText || `Request failed with status ${res.status}`);
    }
  }
  return res.json();
}

export const api = {
  // Auth
  async signup(data: any): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async login(data: any): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Listings
  async getListings(): Promise<ParkingListing[]> {
    const res = await fetch(`${API_BASE}/listings`);
    return handleResponse(res);
  },

  async createListing(data: any): Promise<ParkingListing> {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Bookings
  async getBookings(userId: string): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings?userId=${userId}`);
    return handleResponse(res);
  },

  async createBooking(data: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
