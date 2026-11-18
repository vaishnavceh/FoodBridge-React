import prisma from '../config/db.js';

export const getPublicStats = async () => {
  const totalDelivered = await prisma.donation.count({
    where: { status: 'completed' }
  });

  const totalNgos = await prisma.user.count({
    where: { role: 'ngo' }
  });

  const totalVolunteers = await prisma.user.count({
    where: { role: 'volunteer' }
  });

  const totalDonors = await prisma.user.count({
    where: { role: 'donor' }
  });

  return {
    total_delivered: totalDelivered,
    total_ngos: totalNgos,
    total_volunteers: totalVolunteers,
    total_donors: totalDonors
  };
};
