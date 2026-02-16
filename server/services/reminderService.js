import cron from 'node-cron';
import { sendEmail } from '../services/emailService.js';
import { generateScholarshipReminderTemplate } from '../utils/scholarshipEmailTemplates.js';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';
import { Subscription } from '../models/Subscription.js';

class ScholarshipReminderService {
  // ─── Get Scholarships Opening Soon ────────────────────────────────────────
  async getOpeningSoon(daysBefore = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + daysBefore);

    return ScholarshipCalendar.find({
      status: 'upcoming',
      reminderSent: false,
      openingDate: { $gte: now, $lte: future },
    })
      .sort({ openingDate: 1 })
      .lean();
  }

  // ─── Send Email to One Subscriber ─────────────────────────────────────────
  async sendReminder(email, scholarships) {
    try {
      await sendEmail({
        to: email,
        subject: `📅 ${scholarships.length} Scholarship(s) Opening Soon!`,
        message: generateScholarshipReminderTemplate(scholarships),
      });
      console.log(`✔ Reminder sent → ${email}`);
      return true;
    } catch (err) {
      console.error(`✖ Failed to send to ${email}:`, err.message);
      return false;
    }
  }

  // ─── Send to All Subscribers ──────────────────────────────────────────────
  async sendAllReminders(daysBefore = 7) {
    const scholarships = await this.getOpeningSoon(daysBefore);

    if (!scholarships.length) {
      console.log(`[Reminders] No scholarships opening in next ${daysBefore} day(s).`);
      return;
    }

    console.log(`[Reminders] ${scholarships.length} scholarship(s) opening in ${daysBefore} day(s):`);
    scholarships.forEach((s) => console.log(`  • ${s.scholarshipName} (${s.university}) — ${s.openingDate}`));

    const subscribers = await Subscription.find({ active: true }).distinct('email');

    if (!subscribers.length) {
      console.log('[Reminders] No active subscribers.');
      return;
    }

    console.log(`[Reminders] Sending to ${subscribers.length} subscriber(s)...`);

    let sent = 0;
    for (const email of subscribers) {
      const ok = await this.sendReminder(email, scholarships);
      if (ok) sent++;
      // Rate-limiting: 1 second between emails
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`[Reminders] ✔ ${sent}/${subscribers.length} reminders sent.`);

    // Mark as reminded
    const ids = scholarships.map((s) => s._id);
    await ScholarshipCalendar.updateMany({ _id: { $in: ids } }, { reminderSent: true });
  }

  // ─── Check & Remind (called by cron) ─────────────────────────────────────
  async checkAndRemind() {
    console.log(`\n[${new Date().toISOString()}] Checking for upcoming scholarships...`);
    await this.sendAllReminders(7);
    await this.sendAllReminders(1);
  }

  // ─── Start Cron Scheduler ────────────────────────────────────────────────
  startScheduler() {
    // Run every day at 09:00
    cron.schedule('0 9 * * *', () => this.checkAndRemind(), {
      timezone: 'Asia/Kathmandu',
    });

    console.log('⏰ Scholarship reminder scheduler started (daily @ 09:00 NPT)');

    // Run once on startup in non-production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Reminders] Running initial check (dev mode)...');
      this.checkAndRemind().catch(console.error);
    }
  }
}

export default new ScholarshipReminderService();