import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async ({ username, email, password, role, location }) => {
  // Check if username or email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });

  if (existingUser) {
    const error = new Error('Username or Email already registered.');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
      location
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      location: true,
      created_at: true
    }
  });

  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role
  });

  return { user: newUser, token };
};

export const loginUser = async ({ username, password }) => {
  // Donor, NGO, Volunteer login (exclude admin)
  const user = await prisma.user.findFirst({
    where: {
      username,
      role: {
        in: ['donor', 'ngo', 'volunteer']
      }
    }
  });

  if (!user) {
    const error = new Error('Access denied or account does not exist.');
    error.statusCode = 401;
    throw error;
  }

  // Check bcrypt hash or legacy plain text (as in original PHP register.php)
  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (e) {
    isMatch = false;
  }

  // Support legacy plain text password and auto-upgrade to bcrypt
  if (!isMatch && user.password === password) {
    isMatch = true;
    const newHashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashed }
    });
  }

  if (!isMatch) {
    const error = new Error('Invalid credentials. Please try again.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      location: user.location,
      created_at: user.created_at
    },
    token
  };
};

export const loginAdmin = async ({ username, password }) => {
  const admin = await prisma.user.findFirst({
    where: {
      username,
      role: 'admin'
    }
  });

  if (!admin) {
    const error = new Error('Access Denied: Admin credentials invalid.');
    error.statusCode = 401;
    throw error;
  }

  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, admin.password);
  } catch (e) {
    isMatch = false;
  }

  if (!isMatch && admin.password === password) {
    isMatch = true;
    const newHashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: newHashed }
    });
  }

  if (!isMatch) {
    const error = new Error('Access Denied: Admin credentials invalid.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    id: admin.id,
    username: admin.username,
    role: admin.role
  });

  return {
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      location: admin.location
    },
    token
  };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      location: true,
      created_at: true
    }
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};
