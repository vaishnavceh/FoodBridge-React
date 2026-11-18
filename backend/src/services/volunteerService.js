import prisma from '../config/db.js';

export const getTasks = async (volunteerId) => {
  // 1. Available missions
  const available = await prisma.donation.findMany({
    where: {
      status: 'available'
    },
    include: {
      donor: {
        select: {
          id: true,
          username: true,
          location: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  // 2. Active (claimed by this volunteer and in progress)
  const active = await prisma.donation.findMany({
    where: {
      status: 'pending',
      volunteer_id: volunteerId
    },
    include: {
      donor: {
        select: {
          id: true,
          username: true,
          location: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return { available, active };
};

export const getHistory = async (volunteerId) => {
  return prisma.donation.findMany({
    where: {
      volunteer_id: volunteerId,
      status: 'completed'
    },
    include: {
      donor: {
        select: {
          id: true,
          username: true,
          location: true
        }
      }
    },
    orderBy: { updated_at: 'desc' }
  });
};
