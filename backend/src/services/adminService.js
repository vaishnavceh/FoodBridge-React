import prisma from '../config/db.js';

export const getAdminStats = async () => {
  const totalUsers = await prisma.user.count();

  // Role counts
  const roleGroups = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      role: true
    }
  });

  const roleCounts = roleGroups.map((r) => ({
    role: r.role,
    count: r._count.role
  }));

  // Status counts
  const statusGroups = await prisma.donation.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });

  const statusCounts = statusGroups.map((s) => ({
    status: s.status || 'unknown',
    count: s._count.status
  }));

  const totalDonations = await prisma.donation.count();
  const totalRequests = await prisma.request.count();

  return {
    totalUsers,
    totalDonations,
    totalRequests,
    roleCounts,
    statusCounts
  };
};

export const getAdminUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      location: true,
      created_at: true
    },
    orderBy: { created_at: 'desc' }
  });

  const donors = users.filter((u) => u.role === 'donor');
  const ngos = users.filter((u) => u.role === 'ngo');
  const volunteers = users.filter((u) => u.role === 'volunteer');

  return {
    donors,
    ngos,
    volunteers,
    all: users
  };
};

export const deleteUser = async (userId, adminId) => {
  if (userId === adminId) {
    const error = new Error('You cannot delete your own admin account.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.delete({
    where: { id: userId }
  });
};

export const getLogistics = async () => {
  return prisma.donation.findMany({
    include: {
      donor: {
        select: {
          id: true,
          username: true
        }
      },
      volunteer: {
        select: {
          id: true,
          username: true
        }
      },
      claimer: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};
