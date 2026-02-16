/**
 * Seed Script – 2026 Scholarship Calendar
 * Run: node scripts/seedScholarships.js
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';
import Scholarship from '../models/Scholarship.js';

config();

// ─── Sample 2026 Calendar Data ────────────────────────────────────────────────
const calendarData = [
  // JANUARY 2026
  { university: 'Tribhuvan University', scholarshipName: 'TU Merit Scholarship - Spring 2026', openingDate: '2026-01-15', closingDate: '2026-02-15', year: 2026, level: 'Undergraduate', description: 'Merit-based scholarship for spring semester', sourceUrl: 'https://tu.edu.np' },

  // FEBRUARY 2026
  { university: 'Kathmandu University', scholarshipName: 'KU Financial Aid Program', openingDate: '2026-02-01', closingDate: '2026-03-01', year: 2026, level: 'All Levels', description: 'Need-based financial assistance', sourceUrl: 'https://ku.edu.np' },
  { university: 'Pokhara University', scholarshipName: 'Engineering Excellence Scholarship', openingDate: '2026-02-10', closingDate: '2026-03-10', year: 2026, level: 'Undergraduate', description: 'For engineering students', sourceUrl: 'https://pu.edu.np' },

  // MARCH 2026
  { university: 'Agriculture and Forestry University', scholarshipName: 'Agricultural Research Fellowship', openingDate: '2026-03-01', closingDate: '2026-04-01', year: 2026, level: 'Postgraduate', description: 'Research in agriculture', sourceUrl: 'https://afu.edu.np' },
  { university: 'Nepal Sanskrit University', scholarshipName: 'Sanskrit Studies Scholarship', openingDate: '2026-03-15', closingDate: '2026-04-15', year: 2026, level: 'All Levels', description: 'For Sanskrit language students', sourceUrl: 'https://nsu.edu.np' },
  { university: 'Purbanchal University', scholarshipName: 'PU Academic Excellence Award', openingDate: '2026-03-20', closingDate: '2026-04-20', year: 2026, level: 'Undergraduate', description: 'Merit-based award', sourceUrl: 'https://purbanchal.edu.np' },

  // APRIL 2026
  { university: 'Kathmandu University', scholarshipName: 'KU Research Grant - Spring', openingDate: '2026-04-01', closingDate: '2026-05-01', year: 2026, level: 'PhD', description: 'Research grants for PhD students', sourceUrl: 'https://ku.edu.np' },
  { university: 'Lumbini Buddhist University', scholarshipName: 'Buddhist Studies Scholarship', openingDate: '2026-04-05', closingDate: '2026-05-05', year: 2026, level: 'Postgraduate', description: 'For Buddhist philosophy students', sourceUrl: 'https://lbu.edu.np' },
  { university: 'Mid-Western University', scholarshipName: 'Regional Development Scholarship', openingDate: '2026-04-10', closingDate: '2026-05-10', year: 2026, level: 'All Levels', description: 'For students from Madhyapaschim', sourceUrl: 'https://mwu.edu.np' },

  // MAY 2026
  { university: 'Tribhuvan University', scholarshipName: 'TU Need-Based Scholarship', openingDate: '2026-05-01', closingDate: '2026-06-01', year: 2026, level: 'All Levels', description: 'Financial aid for needy students', sourceUrl: 'https://tu.edu.np' },
  { university: 'Madan Bhandari University of Science & Technology', scholarshipName: 'AI & Data Science Fellowship', openingDate: '2026-05-15', closingDate: '2026-06-15', year: 2026, level: 'Postgraduate', description: 'For AI/ML research', sourceUrl: 'https://mbust.edu.np' },

  // JUNE 2026
  { university: 'Pokhara University', scholarshipName: 'PU Sports Scholarship', openingDate: '2026-06-01', closingDate: '2026-07-01', year: 2026, level: 'Undergraduate', description: 'For talented athletes', sourceUrl: 'https://pu.edu.np' },
  { university: 'Rajarshi Janak University', scholarshipName: 'Madhesh Development Scholarship', openingDate: '2026-06-10', closingDate: '2026-07-10', year: 2026, level: 'Undergraduate', description: 'For Madhesh province students', sourceUrl: 'https://rju.edu.np' },

  // JULY 2026
  { university: 'Sudurpaschim University', scholarshipName: 'Far Western Excellence Award', openingDate: '2026-07-01', closingDate: '2026-08-01', year: 2026, level: 'All Levels', description: 'Merit-based scholarship', sourceUrl: 'https://fwu.edu.np' },
  { university: 'Tribhuvan University', scholarshipName: 'TU Research Fellowship - Fall', openingDate: '2026-07-15', closingDate: '2026-08-15', year: 2026, level: 'PhD', description: 'Research fellowships', sourceUrl: 'https://tu.edu.np' },
  { university: 'Martyr Dashrath Chand Health Science University', scholarshipName: 'Medical Studies Scholarship', openingDate: '2026-07-20', closingDate: '2026-08-20', year: 2026, level: 'Undergraduate', description: 'For MBBS students', sourceUrl: 'https://dhsuniversity.edu.np' },

  // AUGUST 2026
  { university: 'Kathmandu University', scholarshipName: 'KU Merit Scholarship - Fall 2026', openingDate: '2026-08-01', closingDate: '2026-09-01', year: 2026, level: 'Undergraduate', description: 'Fall semester merit scholarship', sourceUrl: 'https://ku.edu.np' },
  { university: 'Agriculture and Forestry University', scholarshipName: 'Sustainable Agriculture Grant', openingDate: '2026-08-10', closingDate: '2026-09-10', year: 2026, level: 'Postgraduate', description: 'For sustainable farming research', sourceUrl: 'https://afu.edu.np' },
  { university: 'Nepal Open University', scholarshipName: 'Distance Learning Scholarship', openingDate: '2026-08-15', closingDate: '2026-09-15', year: 2026, level: 'All Levels', description: 'For distance education students', sourceUrl: 'https://nou.edu.np' },

  // SEPTEMBER 2026
  { university: 'Pokhara University', scholarshipName: 'PU MBA Scholarship', openingDate: '2026-09-01', closingDate: '2026-10-01', year: 2026, level: 'Postgraduate', description: 'For MBA students', sourceUrl: 'https://pu.edu.np' },
  { university: 'Purbanchal University', scholarshipName: 'Engineering Research Grant', openingDate: '2026-09-10', closingDate: '2026-10-10', year: 2026, level: 'Postgraduate', description: 'For engineering research', sourceUrl: 'https://purbanchal.edu.np' },
  { university: 'Yogamaya Ayurveda University', scholarshipName: 'Ayurvedic Studies Scholarship', openingDate: '2026-09-15', closingDate: '2026-10-15', year: 2026, level: 'All Levels', description: 'For Ayurveda students', sourceUrl: 'https://yau.edu.np' },

  // OCTOBER 2026
  { university: 'Tribhuvan University', scholarshipName: 'TU Women in STEM Scholarship', openingDate: '2026-10-01', closingDate: '2026-11-01', year: 2026, level: 'Undergraduate', description: 'For female STEM students', sourceUrl: 'https://tu.edu.np' },
  { university: 'Lumbini Buddhist University', scholarshipName: 'Buddhist Philosophy Fellowship', openingDate: '2026-10-10', closingDate: '2026-11-10', year: 2026, level: 'PhD', description: 'PhD research fellowship', sourceUrl: 'https://lbu.edu.np' },
  { university: 'Mid-Western University', scholarshipName: 'MWU Excellence Award', openingDate: '2026-10-15', closingDate: '2026-11-15', year: 2026, level: 'All Levels', description: 'Academic excellence award', sourceUrl: 'https://mwu.edu.np' },

  // NOVEMBER 2026
  { university: 'Kathmandu University', scholarshipName: 'KU International Scholarship', openingDate: '2026-11-01', closingDate: '2026-12-01', year: 2026, level: 'Postgraduate', description: 'For international collaboration', sourceUrl: 'https://ku.edu.np' },
  { university: 'Nepal Sanskrit University', scholarshipName: 'Vedic Research Grant', openingDate: '2026-11-10', closingDate: '2026-12-10', year: 2026, level: 'PhD', description: 'For Vedic studies research', sourceUrl: 'https://nsu.edu.np' },
  { university: 'Madan Bhandari University of Science & Technology', scholarshipName: 'Innovation Scholarship', openingDate: '2026-11-15', closingDate: '2026-12-15', year: 2026, level: 'All Levels', description: 'For innovative projects', sourceUrl: 'https://mbust.edu.np' },

  // DECEMBER 2026
  { university: 'Tribhuvan University', scholarshipName: 'TU Final Year Excellence Award', openingDate: '2026-12-01', closingDate: '2027-01-01', year: 2026, level: 'Undergraduate', description: 'For final year students', sourceUrl: 'https://tu.edu.np' },
  { university: 'Pokhara University', scholarshipName: 'PU Year-End Scholarship', openingDate: '2026-12-10', closingDate: '2027-01-10', year: 2026, level: 'All Levels', description: 'Year-end scholarship', sourceUrl: 'https://pu.edu.np' },
];

// ─── Sample active scholarships ───────────────────────────────────────────────
const scholarshipData = [
  { title: 'TU Computer Science Scholarship', university: 'Tribhuvan University', level: 'Undergraduate', country: 'Nepal', deadline: new Date('2026-03-31'), link: 'https://tu.edu.np', status: 'active' },
  { title: 'KU Graduate Research Award', university: 'Kathmandu University', level: 'Postgraduate', country: 'Nepal', deadline: new Date('2026-04-15'), link: 'https://ku.edu.np', status: 'active' },
  { title: 'Pokhara University Merit Award', university: 'Pokhara University', level: 'Undergraduate', country: 'Nepal', link: 'https://pu.edu.np', status: 'active' },
  { title: 'AFU Agri Innovation Grant', university: 'Agriculture and Forestry University', level: 'Postgraduate', country: 'Nepal', deadline: new Date('2026-05-01'), link: 'https://afu.edu.np', status: 'active' },
  { title: 'Mid-Western Regional Excellence', university: 'Mid-Western University', level: 'All Levels', country: 'Nepal', link: 'https://mwu.edu.np', status: 'active' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await ScholarshipCalendar.deleteMany({});
    await Scholarship.deleteMany({});
    console.log('Cleared existing scholarship data');

    // Insert calendar
    const inserted = await ScholarshipCalendar.insertMany(calendarData);
    console.log(`Inserted ${inserted.length} calendar events`);

    // Insert scholarships
    const insertedS = await Scholarship.insertMany(scholarshipData);
    console.log(`🎓 Inserted ${insertedS.length} scholarships`);

    // Summary by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const byMonth = await ScholarshipCalendar.aggregate([
      { $group: { _id: { $month: '$openingDate' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log('\nCalendar summary by month:');
    console.log('─'.repeat(50));
    byMonth.forEach(({ _id, count }) =>
      console.log(`  ${monthNames[_id - 1]} 2026 ─── ${count} scholarship(s)`)
    );
    console.log(`  TOTAL ─── ${inserted.length} scholarship(s)`);

    await mongoose.disconnect();
    console.log('\nSeed complete!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
