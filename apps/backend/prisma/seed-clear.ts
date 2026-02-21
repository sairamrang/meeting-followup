import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing all data...');

  // Delete in correct order to respect foreign key constraints
  await prisma.analyticsEvent.deleteMany();
  await prisma.analyticsSession.deleteMany();
  await prisma.followupContact.deleteMany();
  await prisma.followup.deleteMany();
  await prisma.companyContent.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();

  console.log('✅ All data cleared!');

  console.log('\n📝 Creating fresh test data...');

  // Test user ID (use this when logging in with test mode)
  const testUserId = 'test-user-001';

  console.log('✅ Using test user ID:', testUserId);

  // Create Sender Company
  const senderCompany = await prisma.company.create({
    data: {
      name: 'Sender Company',
      website: 'https://sender.example.com',
      industry: 'Technology',
      description: 'This is the sender company - the one creating follow-ups',
      createdBy: testUserId,
    },
  });

  console.log('✅ Created Sender Company:', senderCompany.name);

  // Create 3 Receiver Companies
  const receiver1 = await prisma.company.create({
    data: {
      name: 'Receiver 1',
      website: 'https://receiver1.example.com',
      industry: 'Healthcare',
      description: 'First receiver company',
      createdBy: testUserId,
    },
  });

  const receiver2 = await prisma.company.create({
    data: {
      name: 'Receiver 2',
      website: 'https://receiver2.example.com',
      industry: 'Finance',
      description: 'Second receiver company',
      createdBy: testUserId,
    },
  });

  const receiver3 = await prisma.company.create({
    data: {
      name: 'Receiver 3',
      website: 'https://receiver3.example.com',
      industry: 'Retail',
      description: 'Third receiver company',
      createdBy: testUserId,
    },
  });

  console.log('✅ Created 3 Receiver Companies');

  // Create contacts for receiver companies
  const contact1 = await prisma.contact.create({
    data: {
      companyId: receiver1.id,
      name: 'John Doe',
      email: 'john@receiver1.example.com',
      role: 'CEO',
      phone: '+1-555-0101',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      companyId: receiver2.id,
      name: 'Jane Smith',
      email: 'jane@receiver2.example.com',
      role: 'CTO',
      phone: '+1-555-0102',
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      companyId: receiver3.id,
      name: 'Bob Johnson',
      email: 'bob@receiver3.example.com',
      role: 'VP of Operations',
      phone: '+1-555-0103',
    },
  });

  console.log('✅ Created contacts for all receiver companies');

  // Create sample follow-ups
  const followup1 = await prisma.followup.create({
    data: {
      title: 'Healthcare Platform Pitch',
      slug: 'receiver-1-healthcare-platform-pitch',
      userId: testUserId,
      companyId: receiver1.id, // Legacy field
      senderCompanyId: senderCompany.id,
      receiverCompanyId: receiver1.id,
      meetingDate: new Date('2026-02-01'),
      meetingType: 'SALES',
      meetingLocation: 'Zoom',
      product: 'Healthcare Analytics Platform',
      meetingRecap: '<p>Great discussion about how our analytics platform can help Receiver 1 improve patient outcomes.</p>',
      valueProposition: '<p>Our platform can reduce patient readmission rates by 25% and improve care coordination across your network.</p>',
      nextSteps: [
        {
          action: 'Schedule technical demo',
          owner: 'John Doe',
          deadline: '2026-02-15',
          completed: false,
        },
        {
          action: 'Review pricing proposal',
          owner: 'Jane Smith',
          deadline: '2026-02-20',
          completed: false,
        },
      ],
      senderId: contact1.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  const followup2 = await prisma.followup.create({
    data: {
      title: 'Financial Services Integration',
      slug: 'receiver-2-financial-services-integration',
      userId: testUserId,
      companyId: receiver2.id, // Legacy field
      senderCompanyId: senderCompany.id,
      receiverCompanyId: receiver2.id,
      meetingDate: new Date('2026-02-05'),
      meetingType: 'PARTNERSHIP',
      meetingLocation: 'In-person at Receiver 2 HQ',
      product: 'Payment Processing API',
      meetingRecap: '<p>Discussed integration of our payment API with Receiver 2\'s financial platform. Strong interest in real-time settlement features.</p>',
      valueProposition: '<p>Reduce transaction processing time by 80% and save $500K annually in payment processing fees.</p>',
      nextSteps: [
        {
          action: 'API documentation review',
          owner: 'Jane Smith',
          deadline: '2026-02-12',
          completed: false,
        },
        {
          action: 'Security audit coordination',
          owner: 'Bob Johnson',
          deadline: '2026-02-18',
          completed: false,
        },
      ],
      senderId: contact2.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  const followup3 = await prisma.followup.create({
    data: {
      title: 'Retail Analytics Solution',
      slug: 'receiver-3-retail-analytics-solution',
      userId: testUserId,
      companyId: receiver3.id, // Legacy field
      senderCompanyId: senderCompany.id,
      receiverCompanyId: receiver3.id,
      meetingDate: new Date('2026-02-08'),
      meetingType: 'DEMO',
      meetingLocation: 'Coffee meeting at Starbucks',
      product: 'Retail Analytics Dashboard',
      meetingRecap: '<p>Explored how our retail analytics can help Receiver 3 optimize inventory and increase sales conversion.</p>',
      valueProposition: '<p>Increase sales by 15% through data-driven inventory optimization and customer behavior insights.</p>',
      nextSteps: [
        {
          action: 'Pilot program setup',
          owner: 'Bob Johnson',
          deadline: '2026-02-22',
          completed: false,
        },
      ],
      senderId: contact3.id,
      status: 'DRAFT',
    },
  });

  console.log('✅ Created 3 sample follow-ups');

  // Create some analytics data for published follow-ups
  const session1 = await prisma.analyticsSession.create({
    data: {
      followupId: followup1.id,
      sessionStart: new Date('2026-02-09T09:00:00'),
      sessionEnd: new Date('2026-02-09T09:05:00'),
      pageDuration: 300,
      deviceType: 'DESKTOP',
      browser: 'Chrome',
      locationCity: 'San Francisco',
      locationCountry: 'United States',
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      followupId: followup1.id,
      sessionId: session1.id,
      eventType: 'PAGE_VIEW',
      deviceType: 'DESKTOP',
      browser: 'Chrome',
      locationCity: 'San Francisco',
      locationCountry: 'United States',
      ipHash: 'test-hash-001',
    },
  });

  console.log('✅ Created sample analytics data');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Test User ID: test-user-001');
  console.log('  - 1 sender company (Sender Company)');
  console.log('  - 3 receiver companies (Receiver 1, 2, 3)');
  console.log('  - 3 contacts (one per receiver)');
  console.log('  - 3 follow-ups (2 published, 1 draft)');
  console.log('\n✨ Login with test mode to see the clear sender/receiver structure!');
  console.log('💡 Make sure VITE_TEST_MODE=true in your .env file');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
