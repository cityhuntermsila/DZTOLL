import { db_data } from '../src/lib/db-data';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    return res.status(200).json(db_data.listings);
  }

  if (req.method === 'POST') {
    const listing = { ...req.body, id: uuidv4(), createdAt: Date.now() };
    db_data.listings.push(listing);
    return res.status(200).json(listing);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
