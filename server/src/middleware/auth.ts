import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_etoile_noir_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'super_secret_etoile_noir_key_2026';
      const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
      req.user = decoded;
    } catch (err) {
      // Ignore invalid token in optionalAuth
    }
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden. Access restricted to administrator accounts.' });
    return;
  }

  next();
};
