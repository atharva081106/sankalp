import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'

async function main() {
  console.log("Seeding massive real-world startup dataset...")

  // Clear existing data
  await prisma.milestone.deleteMany()
  await prisma.pilot.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.graphEdge.deleteMany()
  await prisma.graphNode.deleteMany()
  await prisma.requirement.deleteMany()
  await prisma.department.deleteMany()
  await prisma.startup.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('password123', 10)

  // ---------------------------------------------------------------------------
  // 1. ADMIN & EVALUATOR
  // ---------------------------------------------------------------------------
  await prisma.user.create({
    data: { email: 'admin@gov.in', passwordHash, role: 'ADMIN', verified: true }
  })

  await prisma.user.create({
    data: { email: 'evaluator@gov.in', passwordHash, role: 'EVALUATOR', verified: true }
  })

  // ---------------------------------------------------------------------------
  // 2. DEPARTMENTS
  // ---------------------------------------------------------------------------
  const deptsData = [
    { name: 'ISRO', ministry: 'Department of Space', jurisdiction: 'Central' },
    { name: 'Ministry of Finance', ministry: 'Finance', jurisdiction: 'Central' },
    { name: 'Ministry of Health', ministry: 'Health & Family Welfare', jurisdiction: 'Central' },
    { name: 'Ministry of Urban Dev', ministry: 'Housing and Urban Affairs', jurisdiction: 'Central' },
    { name: 'Ministry of Tourism', ministry: 'Tourism', jurisdiction: 'Central' },
    { name: 'Ministry of Food', ministry: 'Food Processing Industries', jurisdiction: 'Central' }
  ]

  const departments: any = {}
  for (const d of deptsData) {
    const user = await prisma.user.create({
      data: {
        email: `head@${d.name.toLowerCase().replace(/ /g, '')}.gov.in`,
        passwordHash,
        role: 'DEPARTMENT',
        verified: true,
        department: { create: { name: d.name, ministry: d.ministry, jurisdiction: d.jurisdiction } }
      },
      include: { department: true }
    })
    departments[d.name] = user.department
  }

  // ---------------------------------------------------------------------------
  // 3. STARTUPS
  // ---------------------------------------------------------------------------
  const startupsData = [
    { email: 'deepinder@zomato.com', name: 'Zomato', sector: 'Logistics & Tech', desc: 'Global food delivery and logistics intelligence platform.', stack: '["Go","Python","AWS"]', certs: '["FSSAI","ISO 27001"]' },
    { email: 'falguni@nykaa.com', name: 'Nykaa', sector: 'Health & Supply Chain', desc: 'Omnichannel beauty and wellness logistics network.', stack: '["React","Node.js"]', certs: '["ISO 9001"]' },
    { email: 'nikhil@zerodha.com', name: 'Zerodha', sector: 'FinTech', desc: 'India\'s largest stockbroker and retail financial platform.', stack: '["Go","PostgreSQL","Rust"]', certs: '["SEBI","ISO 27001"]' },
    { email: 'ritesh@oyorooms.com', name: 'OYO', sector: 'Hospitality Tech', desc: 'Global platform empowering hospitality entrepreneurs.', stack: '["Java","Kafka","AWS"]', certs: '["ISO 9001"]' },
    { email: 'aman@boat-lifestyle.com', name: 'boAt', sector: 'Consumer Electronics', desc: 'Leading wearable and audio hardware manufacturer.', stack: '["IoT","C++"]', certs: '["CE","FCC"]' },
    { email: 'bhavish@olaelectric.com', name: 'Ola', sector: 'Mobility & EV', desc: 'EV manufacturing and smart mobility platform.', stack: '["C++","Python","Edge Computing"]', certs: '["ARAI"]' },
    { email: 'pawan@skyroot.in', name: 'Skyroot Aerospace', sector: 'SpaceTech', desc: 'Private aerospace manufacturer and launch service provider.', stack: '["C++","Simulink","Telemetry"]', certs: '["IN-SPACe","ISO 9001"]' },
    { email: 'harshil@razorpay.com', name: 'Razorpay', sector: 'FinTech', desc: 'Leading payments and banking platform for businesses.', stack: '["Go","PHP","AWS"]', certs: '["PCI-DSS","RBI PA"]' }
  ]

  const startups: any = {}
  for (const s of startupsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: 'STARTUP',
        verified: true,
        startup: {
          create: {
            name: s.name,
            sector: s.sector,
            foundedYear: 2010,
            description: s.desc,
            techStack: s.stack,
            certifications: s.certs,
            pastDeployments: '["B2C Scale"]',
            pricingModel: 'Transaction / Hardware',
            makeInIndia: ['Ola', 'Skyroot Aerospace', 'boAt'].includes(s.name)
          }
        }
      },
      include: { startup: true }
    })
    startups[s.name] = user.startup
  }

  // ---------------------------------------------------------------------------
  // 4. REQUIREMENTS
  // ---------------------------------------------------------------------------
  const reqsData = [
    {
      dept: departments['ISRO'],
      prob: `ISRO requires private sector collaboration for low-earth orbit (LEO) micro-satellite deployments. We need reliable, low-cost launch vehicles capable of carrying 500kg payloads to 500km altitude. The launch systems must integrate with existing Sriharikota telemetry systems.`,
      goal: 'LEO Payload Deployment',
      budget: '50Cr - 200Cr',
      loc: 'Sriharikota',
      criteria: '{"reliability":"99%","costPerKg":"< $10,000"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Finance'],
      prob: `The Government needs a unified, ultra-low latency payment gateway to handle tax collections across all 28 states. The system must support UPI, NEFT, and RTGS with 100% uptime and instant settlement, handling peak loads of 10,000 TPS during tax deadlines.`,
      goal: 'Unified Tax Gateway',
      budget: '10Cr - 50Cr',
      loc: 'Pan-India',
      criteria: '{"tps":">10,000","uptime":"99.999%"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Finance'],
      prob: `To increase retail participation in Sovereign Gold Bonds and Government Securities (G-Secs), we need a massive, highly scalable distribution platform. The platform must offer one-click retail investments directly linked to Demat accounts.`,
      goal: 'Retail G-Sec Platform',
      budget: '5Cr - 20Cr',
      loc: 'Pan-India',
      criteria: '{"userBase":">10M active","latency":"<50ms"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Urban Dev'],
      prob: `Metropolitan cities are facing a severe shortage of EV charging infrastructure. We require an intelligent, connected EV grid that optimizes charging loads based on real-time power grid fluctuations and offers universal fast-charging compatibility.`,
      goal: 'Smart EV Grid',
      budget: '100Cr - 500Cr',
      loc: 'Tier 1 Cities',
      criteria: '{"compatibility":"Universal","uptime":"99%"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Health'],
      prob: `Rural primary health centres face severe supply chain issues for female health and hygiene products. We require a robust, last-mile logistics platform capable of tracking inventory, predicting stockouts, and ensuring uninterrupted supply using existing B2C delivery networks.`,
      goal: 'Last-Mile Hygiene Logistics',
      budget: '2Cr - 10Cr',
      loc: 'Rural Tier 3',
      criteria: '{"deliverySLA":"<48 hours","coverage":"90% PIN codes"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Tourism'],
      prob: `Thousands of government-owned guest houses and heritage properties remain underutilized due to poor digital presence and asset management. We require a centralized inventory management and booking system that integrates with global OTAs (Online Travel Agencies).`,
      goal: 'Gov Asset Digitalization',
      budget: '5Cr - 15Cr',
      loc: 'Pan-India',
      criteria: '{"occupancyIncrease":">30%","integration":"Global OTAs"}',
      status: 'PILOTING'
    },
    {
      dept: departments['Ministry of Food'],
      prob: `The Mid-Day Meal scheme requires advanced logistics and supply chain intelligence to monitor food quality, prevent spoilage, and ensure timely delivery to 1.2 million schools across India.`,
      goal: 'Mid-Day Meal Logistics',
      budget: '20Cr - 100Cr',
      loc: 'Pan-India',
      criteria: '{"tracking":"Real-time","spoilageReduction":">50%"}',
      status: 'OPEN'
    },
    {
      dept: departments['Ministry of Health'],
      prob: `We require low-cost, domestically manufactured, medical-grade hearing aids for distribution in rural areas. The devices must be highly durable, dust/water resistant, and feature localized AI noise cancellation for noisy environments.`,
      goal: 'Low-Cost Smart Hearing Aids',
      budget: '10Cr - 50Cr',
      loc: 'Pan-India',
      criteria: '{"costPerUnit":"< ₹1000","durability":"IP67"}',
      status: 'OPEN'
    }
  ]

  const requirements: any = {}
  for (const r of reqsData) {
    const req = await prisma.requirement.create({
      data: {
        departmentId: r.dept.id,
        rawProblem: r.prob,
        structured: JSON.stringify({ goal: r.goal }),
        budgetBand: r.budget,
        location: r.loc,
        eligibility: '{"turnover":">50Cr"}',
        evaluationCriteria: r.criteria,
        status: r.status
      }
    })
    requirements[r.goal] = req
  }

  // ---------------------------------------------------------------------------
  // 5. PROPOSALS, PILOTS & MILESTONES (THE LEDGER DATA)
  // ---------------------------------------------------------------------------
  const pilotData = [
    {
      startup: startups['Skyroot Aerospace'],
      req: requirements['LEO Payload Deployment'],
      pitch: 'Skyroot will deploy the Vikram-1 orbital launch vehicle, providing a highly reliable and cost-effective solution for ISRO\'s micro-satellite requirements. Our solid-propulsion technology ensures rapid assembly and launch.',
      score: 9.5,
      milestones: [
        { title: 'Suborbital Testing', amount: 150000000, status: 'PAID' },
        { title: 'Payload Integration', amount: 200000000, status: 'PAID' },
        { title: 'LEO Launch', amount: 400000000, status: 'SUBMITTED' }
      ]
    },
    {
      startup: startups['Razorpay'],
      req: requirements['Unified Tax Gateway'],
      pitch: 'Razorpay will deploy a sovereign instance of our payment gateway tailored for the Ministry of Finance, capable of 25,000 TPS. We ensure PCI-DSS compliance, auto-scaling, and immediate Treasury settlements.',
      score: 9.2,
      milestones: [
        { title: 'System Architecture & Audit', amount: 50000000, status: 'PAID' },
        { title: 'State-Level Integration', amount: 80000000, status: 'PAID' },
        { title: 'Peak Load Testing (10k TPS)', amount: 100000000, status: 'PAID' },
        { title: 'Go-Live Pan-India', amount: 150000000, status: 'PENDING' }
      ]
    },
    {
      startup: startups['Zerodha'],
      req: requirements['Retail G-Sec Platform'],
      pitch: 'Zerodha will build a dedicated GovSec portal leveraging our Kite architecture. With over 12 million active clients, we will instantly distribute Sovereign Gold Bonds and G-Secs with zero brokerage to drive massive retail adoption.',
      score: 9.8,
      milestones: [
        { title: 'RBI API Integration', amount: 20000000, status: 'PAID' },
        { title: 'Beta Launch (1M Users)', amount: 40000000, status: 'PAID' },
        { title: 'Full Retail Rollout', amount: 60000000, status: 'PENDING' }
      ]
    },
    {
      startup: startups['Ola'],
      req: requirements['Smart EV Grid'],
      pitch: 'Ola Electric proposes deploying 5,000 Hyperchargers across Tier-1 cities. Our connected grid infrastructure will communicate directly with DISCOMs to balance loads during peak hours and provide universal charging for all 2W/3W/4W EVs.',
      score: 8.9,
      milestones: [
        { title: 'Site Acquisition & Survey', amount: 200000000, status: 'PAID' },
        { title: 'First 1000 Chargers Deployed', amount: 500000000, status: 'SUBMITTED' },
        { title: 'Grid Integration Sign-off', amount: 300000000, status: 'PENDING' }
      ]
    },
    {
      startup: startups['Nykaa'],
      req: requirements['Last-Mile Hygiene Logistics'],
      pitch: 'Nykaa will leverage its immense B2C supply chain network to deliver female hygiene products to 3,000 rural PHCs. Our proprietary ML models will predict local demand to ensure zero stockouts.',
      score: 9.1,
      milestones: [
        { title: 'Supply Chain Integration', amount: 10000000, status: 'PAID' },
        { title: 'Pilot in 500 PHCs', amount: 25000000, status: 'PAID' },
        { title: 'Full 3000 PHC Rollout', amount: 45000000, status: 'PENDING' }
      ]
    },
    {
      startup: startups['OYO'],
      req: requirements['Gov Asset Digitalization'],
      pitch: 'OYO will overhaul 500+ government guest houses. We will standardize the properties, implement our cloud property management system (PMS), and list them on global OTAs to immediately boost occupancy by 40%.',
      score: 8.5,
      milestones: [
        { title: 'Audit & Standardization', amount: 15000000, status: 'PAID' },
        { title: 'PMS Integration & Listing', amount: 30000000, status: 'PAID' },
        { title: 'Occupancy Validation', amount: 20000000, status: 'PENDING' }
      ]
    }
  ]

  for (const pd of pilotData) {
    const proposal = await prisma.proposal.create({
      data: {
        requirementId: pd.req.id,
        startupId: pd.startup.id,
        pitch: pd.pitch,
        readinessScore: '{"trl":9,"reasoning":"Production ready."}',
        matchExplanation: '{"fit":"High"}',
        opportunityScore: pd.score,
        status: 'PILOTING'
      }
    })

    const pilot = await prisma.pilot.create({
      data: {
        proposalId: proposal.id,
        scope: 'National rollout phase 1.',
        claimedMetrics: pd.req.evaluationCriteria,
        measuredMetrics: '{}'
      }
    })

    let dDate = new Date()
    for (const m of pd.milestones) {
      dDate.setDate(dDate.getDate() + 30) // Offset dates
      await prisma.milestone.create({
        data: {
          pilotId: pilot.id,
          title: m.title,
          amount: m.amount,
          status: m.status,
          dueDate: new Date(dDate)
        }
      })
    }
  }

  // ---------------------------------------------------------------------------
  // 6. OPEN PROPOSALS (No Pilots yet)
  // ---------------------------------------------------------------------------
  await prisma.proposal.create({
    data: {
      requirementId: requirements['Mid-Day Meal Logistics'].id,
      startupId: startups['Zomato'].id,
      pitch: 'Zomato will deploy its hyper-local tracking fleet software to monitor Mid-Day Meal deliveries across 1.2M schools, using thermal sensors to ensure food safety and prevent spoilage.',
      readinessScore: '{"trl":8,"reasoning":"Customizing existing tech."}',
      matchExplanation: '{"fit":"Perfect match for logistics."}',
      opportunityScore: 9.4,
      status: 'SUBMITTED'
    }
  })

  await prisma.proposal.create({
    data: {
      requirementId: requirements['Low-Cost Smart Hearing Aids'].id,
      startupId: startups['boAt'].id,
      pitch: 'boAt will manufacture IP67-rated smart hearing aids leveraging our existing massive manufacturing lines. Cost will be driven down to ₹800 per unit, featuring AI noise cancellation.',
      readinessScore: '{"trl":7,"reasoning":"Hardware prototype ready."}',
      matchExplanation: '{"fit":"Strong manufacturing capability."}',
      opportunityScore: 8.8,
      status: 'SUBMITTED'
    }
  })


  console.log("Database seeded successfully with massive Unicorn dataset!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
