import prisma from '../config/db.js';

export const browseDonations = async (userId) => {
  const now = new Date();

  // Fetch active donations where expiry > now and (status = 'available' or claimed_by = userId)
  const donations = await prisma.donation.findMany({
    where: {
      expiry: { gt: now },
      OR: [
        { status: 'available' },
        { claimed_by: userId }
      ]
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
    orderBy: [
      { expiry: 'asc' }
    ]
  });

  // Sort so user's claimed ones come first, preserving the exact PHP logic
  return donations.sort((a, b) => {
    const aMine = a.claimed_by === userId ? 1 : 0;
    const bMine = b.claimed_by === userId ? 1 : 0;
    return bMine - aMine;
  });
};

export const createDonation = async (userId, data) => {
  const donation = await prisma.donation.create({
    data: {
      user_id: userId,
      food_type: data.food_type,
      phone: data.phone,
      quantity: data.quantity,
      expiry: new Date(data.expiry),
      freshness: data.freshness,
      location: data.location,
      map_link: data.map_link || data.location,
      availability_from: new Date(data.availability_from),
      availability_to: new Date(data.availability_to),
      status: 'available'
    }
  });

  return donation;
};

export const getMyDonations = async (userId) => {
  return prisma.donation.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
};

export const claimDonation = async (donationId, userId) => {
  // Concurrency-safe atomic update
  const result = await prisma.donation.updateMany({
    where: {
      id: donationId,
      status: 'available'
    },
    data: {
      status: 'claimed',
      claimed_by: userId
    }
  });

  if (result.count === 0) {
    const error = new Error('Donation is already claimed or no longer available.');
    error.statusCode = 409;
    throw error;
  }

  return prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      donor: {
        select: { username: true, email: true, location: true }
      }
    }
  });
};

export const acceptMission = async (donationId, volunteerId) => {
  const result = await prisma.donation.updateMany({
    where: {
      id: donationId,
      status: 'available'
    },
    data: {
      volunteer_id: volunteerId,
      status: 'pending'
    }
  });

  if (result.count === 0) {
    const error = new Error('Mission is no longer available to accept.');
    error.statusCode = 409;
    throw error;
  }

  return prisma.donation.findUnique({
    where: { id: donationId }
  });
};

export const completeMission = async (donationId, volunteerId) => {
  const result = await prisma.donation.updateMany({
    where: {
      id: donationId,
      volunteer_id: volunteerId
    },
    data: {
      status: 'completed'
    }
  });

  if (result.count === 0) {
    const error = new Error('Mission could not be updated or was not assigned to you.');
    error.statusCode = 404;
    throw error;
  }

  return prisma.donation.findUnique({
    where: { id: donationId }
  });
};

export const resetMission = async (donationId) => {
  return prisma.donation.update({
    where: { id: donationId },
    data: {
      status: 'available',
      volunteer_id: null
    }
  });
};

export const deleteDonation = async (donationId) => {
  return prisma.donation.delete({
    where: { id: donationId }
  });
};
