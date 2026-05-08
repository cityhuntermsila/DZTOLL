import { db_data } from './_lib/db';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    const userBookings = db_data.bookings.filter(b => b.renterId === userId || b.ownerId === userId);
    return res.status(200).json(userBookings);
  }
  
  if (req.method === 'POST') {
    const booking = { ...req.body, id: uuidv4(), createdAt: Date.now(), status: 'pending' };
    db_data.bookings.push(booking);
    return res.status(200).json(booking);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
