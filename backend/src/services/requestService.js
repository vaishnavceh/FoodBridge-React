import prisma from '../config/db.js';

export const getOpenRequests = async () => {
  return prisma.request.findMany({
    where: { status: 'open' },
    include: {
      ngo: {
        select: {
          id: true,
          username: true,
          location: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};

export const getMyRequests = async (ngoId) => {
  return prisma.request.findMany({
    where: { ngo_id: ngoId },
    include: {
      fulfiller: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};

export const createRequest = async (ngoId, data) => {
  return prisma.request.create({
    data: {
      ngo_id: ngoId,
      item_needed: data.item_needed,
      quantity_needed: data.quantity_needed,
      map_link: data.map_link || '',
      contact_number: data.contact_number,
      urgency: data.urgency || 'Medium',
      status: 'open'
    }
  });
};

export const fulfillRequest = async (requestId, donorId) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      ngo: {
        select: { id: true, username: true, location: true }
      }
    }
  });

  if (!request) {
    const error = new Error('Request not found.');
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== 'open') {
    const error = new Error('This request has already been fulfilled.');
    error.statusCode = 400;
    throw error;
  }

  // Update request to fulfilled
  const updatedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      status: 'fulfilled',
      fulfilled_by: donorId
    }
  });

  // Create delivery mission in donations table for volunteers (matching view_requests.php)
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const missionDesc = `DELIVERY: ${request.item_needed} to ${request.ngo.username}`;

  const mission = await prisma.donation.create({
    data: {
      user_id: donorId,
      food_type: missionDesc,
      quantity: request.quantity_needed,
      location: request.map_link || request.ngo.location || 'Location details with NGO',
      map_link: request.map_link || null,
      phone: request.contact_number,
      freshness: 'Freshly Prepared',
      expiry: tomorrow,
      availability_from: now,
      availability_to: tomorrow,
      status: 'available'
    }
  });

  return {
    request: updatedRequest,
    mission
  };
};

export const getFulfilledByMe = async (donorId) => {
  return prisma.request.findMany({
    where: {
      status: 'fulfilled',
      fulfilled_by: donorId
    },
    include: {
      ngo: {
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
