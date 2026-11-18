import prisma from '../config/db.js';

export const getDashboardStats = async () => {
  const activeDonations = await prisma.donation.count({
    where: { status: 'available' }
  });

  const openRequests = await prisma.request.count({
    where: { status: 'open' }
  });

  const completedDeliveries = await prisma.donation.count({
    where: { status: 'completed' }
  });

  return {
    active_donations: activeDonations,
    open_requests: openRequests,
    completed_deliveries: completedDeliveries
  };
};

export const getNgoAlerts = async (ngoId) => {
  // Requests fulfilled within the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const fulfilledRequests = await prisma.request.findMany({
    where: {
      ngo_id: ngoId,
      status: 'fulfilled',
      updated_at: { gte: oneDayAgo }
    },
    include: {
      fulfiller: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: { updated_at: 'desc' }
  });

  return fulfilledRequests.map((r) => ({
    id: r.id,
    item_needed: r.item_needed,
    quantity_needed: r.quantity_needed,
    username: r.fulfiller?.username || 'Anonymous Donor',
    updated_at: r.updated_at
  }));
};
