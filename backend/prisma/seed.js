import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FoodBridge database...');

  // Hash passwords
  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const vaishPasswordHash = await bcrypt.hash('sergioramos4', 10);

  // 1. Seed Users
  const donor1 = await prisma.user.upsert({
    where: { username: 'donor1' },
    update: {},
    create: {
      username: 'donor1',
      password: defaultPasswordHash,
      email: 'donor1@example.com',
      role: 'donor',
      location: 'New York'
    }
  });

  const ngo1 = await prisma.user.upsert({
    where: { username: 'ngo1' },
    update: {},
    create: {
      username: 'ngo1',
      password: defaultPasswordHash,
      email: 'ngo1@example.com',
      role: 'ngo',
      location: 'Los Angeles'
    }
  });

  const volunteer1 = await prisma.user.upsert({
    where: { username: 'volunteer1' },
    update: {},
    create: {
      username: 'volunteer1',
      password: defaultPasswordHash,
      email: 'volunteer1@example.com',
      role: 'volunteer',
      location: 'Chicago'
    }
  });

  const admin = await prisma.user.upsert({
    where: { username: 'master_admin' },
    update: {},
    create: {
      username: 'master_admin',
      password: adminPasswordHash,
      email: 'admin@foodbridge.com',
      role: 'admin',
      location: 'Headquarters'
    }
  });

  const vaish = await prisma.user.upsert({
    where: { username: 'vaish123' },
    update: {},
    create: {
      username: 'vaish123',
      password: vaishPasswordHash,
      email: 'vaishnavvfisc@gmail.com',
      role: 'donor',
      location: 'Kollam'
    }
  });

  console.log('Users seeded successfully');

  // 2. Seed Donations if none exist
  const donationCount = await prisma.donation.count();
  if (donationCount === 0) {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    await prisma.donation.createMany({
      data: [
        {
          user_id: donor1.id,
          food_type: 'Vegetable Biryani - 20 Packs',
          phone: '+91 98765 43210',
          quantity: '15 KG',
          expiry: dayAfter,
          freshness: 'Freshly Cooked',
          location: 'https://www.google.com/maps?q=9.2644,76.5133',
          map_link: 'https://www.google.com/maps?q=9.2644,76.5133',
          availability_from: now,
          availability_to: tomorrow,
          status: 'available'
        },
        {
          user_id: donor1.id,
          food_type: 'Assorted Sandwiches',
          phone: '+91 98765 43211',
          quantity: '30 Units',
          expiry: tomorrow,
          freshness: 'Packaged / Sealed',
          location: 'https://www.google.com/maps?q=9.2345,76.5432',
          map_link: 'https://www.google.com/maps?q=9.2345,76.5432',
          availability_from: now,
          availability_to: tomorrow,
          status: 'claimed',
          claimed_by: ngo1.id
        },
        {
          user_id: vaish.id,
          food_type: 'Chapati and Curry Veg',
          phone: '+91 75323 56465',
          quantity: '20 Nos',
          expiry: dayAfter,
          freshness: 'Freshly Cooked',
          location: 'https://www.google.com/maps?q=9.273928,76.517543',
          map_link: 'https://www.google.com/maps?q=9.273928,76.517543',
          availability_from: now,
          availability_to: tomorrow,
          status: 'available'
        },
        {
          user_id: vaish.id,
          volunteer_id: volunteer1.id,
          food_type: 'Steamed Rice & Lentil Dal',
          phone: '+91 98765 43212',
          quantity: '25 KG',
          expiry: tomorrow,
          freshness: 'Freshly Cooked',
          location: 'https://www.google.com/maps?q=9.250039,76.492567',
          map_link: 'https://www.google.com/maps?q=9.250039,76.492567',
          availability_from: now,
          availability_to: tomorrow,
          status: 'completed'
        }
      ]
    });
    console.log('Sample donations seeded');
  }

  // 3. Seed Requests if none exist
  const requestCount = await prisma.request.count();
  if (requestCount === 0) {
    await prisma.request.createMany({
      data: [
        {
          ngo_id: ngo1.id,
          item_needed: 'High-Protein Grain Meals',
          quantity_needed: '50 Packs',
          map_link: 'https://www.google.com/maps?q=9.249717,76.527503',
          contact_number: '+91 98450 11223',
          urgency: 'High',
          status: 'open'
        },
        {
          ngo_id: ngo1.id,
          item_needed: 'Fresh Bread & Milk Cans',
          quantity_needed: '30 Units',
          map_link: 'https://www.google.com/maps?q=9.249717,76.527503',
          contact_number: '+91 98450 11223',
          urgency: 'Medium',
          status: 'fulfilled',
          fulfilled_by: vaish.id
        }
      ]
    });
    console.log('Sample requests seeded');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
