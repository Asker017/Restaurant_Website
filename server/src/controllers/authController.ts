import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_etoile_noir_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: 'customer',
      favorites: []
    });

    const token = generateToken(String(newUser._id), newUser.email, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account successfully registered!',
      token,
      data: {
        id: String(newUser._id),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        favorites: []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email address or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash!);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email address or password.' });
      return;
    }

    const token = generateToken(String(user._id), user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites ? user.favorites.map(f => String(f)) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' }).select('+passwordHash');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid administrator email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash!);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid administrator email or password.' });
      return;
    }

    const token = generateToken(String(user._id), user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful!',
      token,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (emailExists) {
        res.status(400).json({ success: false, message: 'This email is already in use by another account.' });
        return;
      }
    }

    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites ? user.favorites.map(f => String(f)) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { itemId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const favIndex = user.favorites ? user.favorites.findIndex(f => String(f) === itemId) : -1;
    let isFavorited = false;

    if (!user.favorites) user.favorites = [];

    if (favIndex > -1) {
      user.favorites.splice(favIndex, 1);
      isFavorited = false;
    } else {
      user.favorites.push(itemId as any);
      isFavorited = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFavorited ? 'Item added to your favorites!' : 'Item removed from your favorites.',
      isFavorited,
      favorites: user.favorites.map(f => String(f))
    });
  } catch (error) {
    next(error);
  }
};
