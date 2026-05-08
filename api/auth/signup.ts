import { db_data } from '../../src/lib/db-data';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'parkhome-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email, password, displayName, role } = req.body;
  if (db_data.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hashedPassword, displayName, role, createdAt: Date.now() };
  db_data.users.push(user);
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({ user: userWithoutPassword, token });
}
