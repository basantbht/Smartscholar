// seed.js - Complete seed script for Admin and Events

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
require('dotenv').config();

// Import your models
const User = require('./models/User'); // Adjust path as needed
const Event = require('./models/Event'); // Adjust path as needed

// Admin seed data
const adminData = {
  email: 'admin@university.edu',
  password: 'Admin@123456', // Will be hashed
  role: 'Admin',
  isEmailVerified: true,
  verificationStatus: 'Verified',
  adminProfile: {
    firstName: 'System',
    lastName: 'Administrator',
    department: 'IT Administration',
    permissions: [
      'manage_users',
      'manage_colleges',
      'manage_events',
      'manage_system',
      'view_analytics',
      'moderate_content'
    ],
    accessLevel: 'super_admin'
  }
};

// College seed data
const collegesData = [
  {
    email: 'mit@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: true,
    verificationStatus: 'Verified',
    collegeProfile: {
      collegeName: 'Massachusetts Institute of Technology',
      universityAffiliation: 'Independent',
      contactNumber: '+1-617-253-1000',
      website: 'https://www.mit.edu',
      address: {
        street: '77 Massachusetts Avenue',
        city: 'Cambridge',
        state: 'Massachusetts',
        postalCode: '02139',
        country: 'United States'
      },
      establishedYear: 1861,
      accreditation: 'NECHE',
      collegeType: 'Private'
    }
  },
  {
    email: 'stanford@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: true,
    verificationStatus: 'Verified',
    collegeProfile: {
      collegeName: 'Stanford University',
      universityAffiliation: 'Independent',
      contactNumber: '+1-650-723-2300',
      website: 'https://www.stanford.edu',
      address: {
        street: '450 Serra Mall',
        city: 'Stanford',
        state: 'California',
        postalCode: '94305',
        country: 'United States'
      },
      establishedYear: 1885,
      accreditation: 'WASC',
      collegeType: 'Private'
    }
  },
  {
    email: 'berkeley@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: true,
    verificationStatus: 'Verified',
    collegeProfile: {
      collegeName: 'University of California, Berkeley',
      universityAffiliation: 'University of California System',
      contactNumber: '+1-510-642-6000',
      website: 'https://www.berkeley.edu',
      address: {
        street: '200 California Hall',
        city: 'Berkeley',
        state: 'California',
        postalCode: '94720',
        country: 'United States'
      },
      establishedYear: 1868,
      accreditation: 'WASC',
      collegeType: 'Public'
    }
  },
  {
    email: 'harvard@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: true,
    verificationStatus: 'Pending',
    collegeProfile: {
      collegeName: 'Harvard University',
      universityAffiliation: 'Independent',
      contactNumber: '+1-617-495-1000',
      website: 'https://www.harvard.edu',
      address: {
        street: 'Massachusetts Hall',
        city: 'Cambridge',
        state: 'Massachusetts',
        postalCode: '02138',
        country: 'United States'
      },
      establishedYear: 1636,
      accreditation: 'NECHE',
      collegeType: 'Private'
    }
  },
  {
    email: 'caltech@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: true,
    verificationStatus: 'Pending',
    collegeProfile: {
      collegeName: 'California Institute of Technology',
      universityAffiliation: 'Independent',
      contactNumber: '+1-626-395-6811',
      website: 'https://www.caltech.edu',
      address: {
        street: '1200 E California Blvd',
        city: 'Pasadena',
        state: 'California',
        postalCode: '91125',
        country: 'United States'
      },
      establishedYear: 1891,
      accreditation: 'WASC',
      collegeType: 'Private'
    }
  },
  {
    email: 'princeton@college.edu',
    password: 'College@123',
    role: 'College',
    isEmailVerified: false,
    verificationStatus: 'Rejected',
    collegeProfile: {
      collegeName: 'Princeton University',
      universityAffiliation: 'Independent',
      contactNumber: '+1-609-258-3000',
      website: 'https://www.princeton.edu',
      address: {
        street: 'Princeton University',
        city: 'Princeton',
        state: 'New Jersey',
        postalCode: '08544',
        country: 'United States'
      },
      establishedYear: 1746,
      accreditation: 'MSCHE',
      collegeType: 'Private'
    }
  }
];

// Events seed data
const eventsData = [
  {
    title: "TechHack 2026: AI Innovation Challenge",
    description: "Join us for a 48-hour hackathon focused on building AI-powered solutions for real-world problems. Teams will compete for exciting prizes while learning from industry experts and mentors.",
    eventType: "hackathon",
    category: ["Technology", "Artificial Intelligence", "Innovation"],
    startDate: new Date("2026-03-15T09:00:00"),
    endDate: new Date("2026-03-17T18:00:00"),
    registrationDeadline: new Date("2026-03-10T23:59:59"),
    venue: "Main Campus Auditorium",
    address: "123 University Ave, Tech City, TC 12345",
    isOnline: false,
    onlineLink: null,
    organizer: "Computer Science Department",
    organizerEmail: "cs@university.edu",
    organizerPhone: "+1-555-0123",
    registrationFee: 25,
    maxParticipants: 200,
    teamSize: { min: 2, max: 4 },
    eligibility: "Open to all undergraduate and graduate students",
    prizes: "1st Prize: $5,000, 2nd Prize: $3,000, 3rd Prize: $1,500. All participants receive certificates and swag.",
    tags: ["AI", "Machine Learning", "Hackathon", "Innovation", "Tech"],
    status: "published",
    website: "https://techhack2026.university.edu",
    registrationLink: "https://forms.university.edu/techhack2026"
  },
  {
    title: "Web Development Workshop: React & Next.js",
    description: "Learn modern web development with React and Next.js in this intensive hands-on workshop. Perfect for beginners and intermediate developers looking to upgrade their skills.",
    eventType: "workshop",
    category: ["Technology", "Web Development", "Programming"],
    startDate: new Date("2026-02-20T14:00:00"),
    endDate: new Date("2026-02-20T18:00:00"),
    registrationDeadline: new Date("2026-02-18T23:59:59"),
    venue: "Computer Lab B-201",
    address: "Engineering Building, University Campus",
    isOnline: true,
    onlineLink: "https://zoom.us/j/123456789",
    organizer: "Tech Club",
    organizerEmail: "techclub@university.edu",
    organizerPhone: "+1-555-0124",
    registrationFee: 0,
    maxParticipants: 50,
    teamSize: { min: 1, max: 1 },
    eligibility: "Basic programming knowledge required",
    prizes: "Completion certificates for all attendees",
    tags: ["React", "Next.js", "Web Development", "Workshop", "Frontend"],
    status: "published",
    website: "https://techclub.university.edu/workshops",
    registrationLink: "https://forms.university.edu/react-workshop"
  },
  {
    title: "Data Science Summit 2026",
    description: "A full-day conference featuring keynote speakers from leading tech companies, panel discussions on the future of data science, and networking opportunities with industry professionals.",
    eventType: "conference",
    category: ["Technology", "Data Science", "Career"],
    startDate: new Date("2026-04-05T09:00:00"),
    endDate: new Date("2026-04-05T17:00:00"),
    registrationDeadline: new Date("2026-03-30T23:59:59"),
    venue: "Grand Convention Center",
    address: "456 Conference Blvd, Tech City, TC 12346",
    isOnline: false,
    onlineLink: null,
    organizer: "Data Science Society",
    organizerEmail: "dss@university.edu",
    organizerPhone: "+1-555-0125",
    registrationFee: 50,
    maxParticipants: 500,
    teamSize: { min: 1, max: 1 },
    eligibility: "Open to all students and professionals",
    prizes: "Networking opportunities, free lunch, conference materials",
    tags: ["Data Science", "Machine Learning", "AI", "Conference", "Networking"],
    status: "published",
    website: "https://datasciencesummit.university.edu",
    registrationLink: "https://forms.university.edu/ds-summit"
  },
  {
    title: "Startup Pitch Competition",
    description: "Present your startup idea to a panel of investors and entrepreneurs. Win funding, mentorship, and resources to kickstart your entrepreneurial journey.",
    eventType: "competition",
    category: ["Business", "Entrepreneurship", "Innovation"],
    startDate: new Date("2026-03-25T10:00:00"),
    endDate: new Date("2026-03-25T16:00:00"),
    registrationDeadline: new Date("2026-03-18T23:59:59"),
    venue: "Innovation Hub",
    address: "789 Startup Lane, Tech City, TC 12347",
    isOnline: false,
    onlineLink: null,
    organizer: "Entrepreneurship Cell",
    organizerEmail: "ecell@university.edu",
    organizerPhone: "+1-555-0126",
    registrationFee: 15,
    maxParticipants: 30,
    teamSize: { min: 1, max: 5 },
    eligibility: "Must have a viable business idea or early-stage startup",
    prizes: "Winner: $10,000 seed funding, Runner-up: $5,000, 3rd Place: $2,500. All finalists receive 3 months of free mentorship.",
    tags: ["Startup", "Pitch", "Entrepreneurship", "Business", "Investment"],
    status: "published",
    website: "https://ecell.university.edu/pitch",
    registrationLink: "https://forms.university.edu/pitch-competition"
  },
  {
    title: "Cybersecurity Awareness Seminar",
    description: "Learn about the latest cybersecurity threats, best practices for online safety, and career opportunities in cybersecurity from industry experts.",
    eventType: "seminar",
    category: ["Technology", "Cybersecurity", "Education"],
    startDate: new Date("2026-02-28T15:00:00"),
    endDate: new Date("2026-02-28T17:30:00"),
    registrationDeadline: new Date("2026-02-26T23:59:59"),
    venue: "Lecture Hall A-101",
    address: "Main Academic Building, University Campus",
    isOnline: true,
    onlineLink: "https://meet.google.com/abc-defg-hij",
    organizer: "Information Security Club",
    organizerEmail: "infosec@university.edu",
    organizerPhone: "+1-555-0127",
    registrationFee: 0,
    maxParticipants: 100,
    teamSize: { min: 1, max: 1 },
    eligibility: "Open to all",
    prizes: "Digital certificates and cybersecurity resource pack",
    tags: ["Cybersecurity", "Security", "Awareness", "Seminar", "Online Safety"],
    status: "published",
    website: null,
    registrationLink: "https://forms.university.edu/cybersec-seminar"
  },
  {
    title: "Mobile App Development Bootcamp",
    description: "Intensive 3-day bootcamp covering iOS and Android app development using Flutter. Build and deploy your first mobile app by the end of the bootcamp.",
    eventType: "workshop",
    category: ["Technology", "Mobile Development", "Programming"],
    startDate: new Date("2026-04-10T09:00:00"),
    endDate: new Date("2026-04-12T17:00:00"),
    registrationDeadline: new Date("2026-04-05T23:59:59"),
    venue: "Tech Lab Complex",
    address: "Computer Science Building, University Campus",
    isOnline: false,
    onlineLink: null,
    organizer: "Mobile Developers Association",
    organizerEmail: "mobiledev@university.edu",
    organizerPhone: "+1-555-0128",
    registrationFee: 75,
    maxParticipants: 40,
    teamSize: { min: 1, max: 1 },
    eligibility: "Basic programming knowledge in any language",
    prizes: "Certificates, project portfolio piece, potential internship opportunities",
    tags: ["Mobile Development", "Flutter", "iOS", "Android", "Bootcamp"],
    status: "published",
    website: "https://mobiledev.university.edu/bootcamp",
    registrationLink: "https://forms.university.edu/mobile-bootcamp"
  },
  {
    title: "Annual Cultural Fest 2026",
    description: "Celebrate diversity and creativity at our annual cultural festival featuring music, dance, drama, fashion shows, and food from around the world.",
    eventType: "other",
    category: ["Cultural", "Entertainment", "Arts"],
    startDate: new Date("2026-05-01T10:00:00"),
    endDate: new Date("2026-05-03T22:00:00"),
    registrationDeadline: new Date("2026-04-25T23:59:59"),
    venue: "University Sports Complex",
    address: "Athletic Grounds, University Campus",
    isOnline: false,
    onlineLink: null,
    organizer: "Cultural Committee",
    organizerEmail: "cultural@university.edu",
    organizerPhone: "+1-555-0129",
    registrationFee: 10,
    maxParticipants: 2000,
    teamSize: { min: 1, max: 10 },
    eligibility: "Open to all students, faculty, and staff",
    prizes: "Winner in each category receives trophy and cash prizes up to $1,000",
    tags: ["Cultural", "Festival", "Arts", "Music", "Dance", "Entertainment"],
    status: "published",
    website: "https://culturalfest.university.edu",
    registrationLink: "https://forms.university.edu/cultural-fest"
  },
  {
    title: "Blockchain & Cryptocurrency Deep Dive",
    description: "Comprehensive webinar series exploring blockchain technology, cryptocurrencies, smart contracts, and decentralized applications. Perfect for beginners and enthusiasts.",
    eventType: "webinar",
    category: ["Technology", "Blockchain", "Finance"],
    startDate: new Date("2026-03-08T18:00:00"),
    endDate: new Date("2026-03-08T20:00:00"),
    registrationDeadline: new Date("2026-03-07T23:59:59"),
    venue: "Online",
    address: null,
    isOnline: true,
    onlineLink: "https://webinar.university.edu/blockchain",
    organizer: "Blockchain Research Group",
    organizerEmail: "blockchain@university.edu",
    organizerPhone: null,
    registrationFee: 0,
    maxParticipants: 500,
    teamSize: { min: 1, max: 1 },
    eligibility: "Open to all interested learners",
    prizes: "Digital certificates and access to recorded sessions",
    tags: ["Blockchain", "Cryptocurrency", "Web3", "DeFi", "Webinar"],
    status: "published",
    website: "https://blockchain.university.edu",
    registrationLink: "https://forms.university.edu/blockchain-webinar"
  },
  {
    title: "Game Development Challenge 2026",
    description: "48-hour game jam where teams create innovative games using Unity or Unreal Engine. Showcase your creativity and technical skills in game development.",
    eventType: "competition",
    category: ["Technology", "Gaming", "Development"],
    startDate: new Date("2026-04-18T18:00:00"),
    endDate: new Date("2026-04-20T18:00:00"),
    registrationDeadline: new Date("2026-04-15T23:59:59"),
    venue: "Gaming Lab & Online",
    address: "Media Arts Building, University Campus",
    isOnline: true,
    onlineLink: "https://discord.gg/gamejam2026",
    organizer: "Game Development Club",
    organizerEmail: "gamedev@university.edu",
    organizerPhone: "+1-555-0130",
    registrationFee: 20,
    maxParticipants: 150,
    teamSize: { min: 1, max: 4 },
    eligibility: "Basic knowledge of Unity or Unreal Engine",
    prizes: "1st: $3,000 + gaming setup, 2nd: $1,500, 3rd: $750. Best narrative and best art awards of $500 each.",
    tags: ["Game Development", "Unity", "Unreal", "Gaming", "Competition"],
    status: "published",
    website: "https://gamedev.university.edu/gamejam",
    registrationLink: "https://forms.university.edu/game-jam"
  },
  {
    title: "AI Ethics & Society Panel Discussion",
    description: "Join leading researchers, ethicists, and policymakers for a thought-provoking discussion on the ethical implications of AI in society, privacy concerns, and responsible AI development.",
    eventType: "seminar",
    category: ["Technology", "Ethics", "Society"],
    startDate: new Date("2026-03-30T14:00:00"),
    endDate: new Date("2026-03-30T16:30:00"),
    registrationDeadline: new Date("2026-03-28T23:59:59"),
    venue: "Philosophy Department Auditorium",
    address: "Humanities Building, University Campus",
    isOnline: true,
    onlineLink: "https://zoom.us/j/987654321",
    organizer: "AI Ethics Initiative",
    organizerEmail: "aiethics@university.edu",
    organizerPhone: "+1-555-0131",
    registrationFee: 0,
    maxParticipants: 300,
    teamSize: { min: 1, max: 1 },
    eligibility: "Open to all",
    prizes: "Certificates of participation and access to panel resources",
    tags: ["AI", "Ethics", "Society", "Panel", "Discussion"],
    status: "published",
    website: "https://aiethics.university.edu",
    registrationLink: null
  },
  {
    title: "Summer Research Symposium 2026 [Draft]",
    description: "Showcase your research projects and findings from the summer research program. Present posters, demos, and papers to faculty and peers.",
    eventType: "conference",
    category: ["Research", "Academic", "Science"],
    startDate: new Date("2026-08-15T09:00:00"),
    endDate: new Date("2026-08-15T17:00:00"),
    registrationDeadline: new Date("2026-08-01T23:59:59"),
    venue: "Science Center",
    address: "Research Complex, University Campus",
    isOnline: false,
    onlineLink: null,
    organizer: "Office of Undergraduate Research",
    organizerEmail: "research@university.edu",
    organizerPhone: "+1-555-0132",
    registrationFee: 0,
    maxParticipants: 200,
    teamSize: { min: 1, max: 3 },
    eligibility: "Summer research program participants only",
    prizes: "Best presentation awards in each category",
    tags: ["Research", "Science", "Symposium", "Academic"],
    status: "draft",
    website: null,
    registrationLink: null
  },
  {
    title: "Spring Career Fair 2026 [Cancelled]",
    description: "Meet with recruiters from top companies, attend workshops on resume building and interview skills, and explore internship and full-time opportunities.",
    eventType: "other",
    category: ["Career", "Networking", "Professional Development"],
    startDate: new Date("2026-03-01T10:00:00"),
    endDate: new Date("2026-03-01T16:00:00"),
    registrationDeadline: new Date("2026-02-25T23:59:59"),
    venue: "Student Union Ballroom",
    address: "Student Center, University Campus",
    isOnline: false,
    onlineLink: null,
    organizer: "Career Services Office",
    organizerEmail: "careers@university.edu",
    organizerPhone: "+1-555-0133",
    registrationFee: 0,
    maxParticipants: 1000,
    teamSize: { min: 1, max: 1 },
    eligibility: "All students and recent alumni",
    prizes: null,
    tags: ["Career", "Jobs", "Networking", "Internships"],
    status: "cancelled",
    website: "https://careers.university.edu",
    registrationLink: null
  }
];

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({ role: { $in: ['Admin', 'College'] } });
    await Event.deleteMany({});
    console.log('Existing data cleared');

    // Hash passwords and create admin
    console.log('Creating admin account...');
    const hashedAdminPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await User.create({
      ...adminData,
      password: hashedAdminPassword
    });
    console.log(`✓ Admin created: ${admin.email}`);

    // Create colleges
    console.log('\nCreating college accounts...');
    for (const college of collegesData) {
      const hashedPassword = await bcrypt.hash(college.password, 10);
      const newCollege = await User.create({
        ...college,
        password: hashedPassword
      });
      console.log(`✓ College created: ${newCollege.collegeProfile.collegeName} (${newCollege.verificationStatus})`);
    }

    // Get a verified college to assign as event creator
    const verifiedCollege = await User.findOne({ 
      role: 'College', 
      verificationStatus: 'Verified' 
    });

    // Create events
    console.log('\nCreating events...');
    for (const eventData of eventsData) {
      const event = await Event.create({
        ...eventData,
        createdBy: verifiedCollege._id // Assign to first verified college
      });
      console.log(`✓ Event created: ${event.title} (${event.status})`);
    }

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nLogin Credentials:');
    console.log('------------------');
    console.log('Admin:');
    console.log(`  Email: ${adminData.email}`);
    console.log(`  Password: ${adminData.password}`);
    console.log('\nColleges (all use password: College@123):');
    collegesData.forEach(college => {
      console.log(`  - ${college.collegeProfile.collegeName}`);
      console.log(`    Email: ${college.email}`);
      console.log(`    Status: ${college.verificationStatus}`);
    });
    console.log('\nEvents created: 12');
    console.log('  - Published: 10');
    console.log('  - Draft: 1');
    console.log('  - Cancelled: 1');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();