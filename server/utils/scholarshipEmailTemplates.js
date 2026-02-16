/**
 * Scholarship Reminder Email Template
 */
export function generateScholarshipReminderTemplate(scholarships) {
  const scholarshipCards = scholarships
    .map((s) => {
      const openDate = new Date(s.openingDate).toLocaleDateString('en-NP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const closeDate = s.closingDate
        ? new Date(s.closingDate).toLocaleDateString('en-NP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null;

      return `
        <div style="background:#fff;padding:20px;margin:15px 0;border-left:4px solid #667eea;border-radius:5px;box-shadow:0 2px 4px rgba(0,0,0,.07)">
          <div style="color:#667eea;font-weight:bold;font-size:14px">${s.university}</div>
          <h3 style="margin:8px 0;font-size:18px;color:#222">${s.scholarshipName}</h3>
          <span style="background:#51cf66;color:#fff;padding:4px 12px;border-radius:15px;display:inline-block;font-weight:bold;margin:8px 0">
            Opens: ${openDate}
          </span>
          ${closeDate ? `<span style="background:#ff6b6b;color:#fff;padding:4px 12px;border-radius:15px;display:inline-block;margin:8px 5px">Deadline: ${closeDate}</span>` : ''}
          ${s.description ? `<p style="color:#555;margin-top:10px;font-size:14px">${s.description.slice(0, 200)}...</p>` : ''}
          ${s.sourceUrl ? `<a href="${s.sourceUrl}" style="color:#667eea;font-size:14px">View Details →</a>` : ''}
        </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:30px;text-align:center;border-radius:8px 8px 0 0">
    <h1 style="margin:0">Scholarships Opening Soon!</h1>
    <p style="margin:8px 0 0">Don't miss these upcoming opportunities</p>
  </div>
  <div style="padding:20px;background:#f9f9f9">
    <p>Hi there,</p>
    <p>The following scholarships are opening soon. Mark your calendar!</p>
    ${scholarshipCards}
    <p style="margin-top:30px;padding:15px;background:#e8f4fd;border-radius:5px">
      <strong>💡 Pro Tip:</strong> Set a reminder on your phone and prepare your documents in advance!
    </p>
    <p style="font-size:12px;color:#888;margin-top:20px;text-align:center">
      You received this because you subscribed to Nepal Scholarship Alerts.<br/>
      <a href="#" style="color:#667eea">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

/**
 * Scholarship Subscription Confirmation Email
 */
export function generateScholarshipSubscriptionTemplate(email) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#667eea;">Scholarship Alerts Activated</h2>
      <p>Thank you for subscribing to Nepal Scholarship Alerts!</p>
      <p>You will now receive notifications about:</p>
      <ul style="color:#555;">
        <li>New scholarship opportunities</li>
        <li>Application deadlines</li>
        <li>Opening dates for scholarships</li>
      </ul>
      <p style="margin-top:20px;color:#666;">Your email: <strong>${email}</strong></p>
      <p style="font-size:12px;color:#888;margin-top:30px;">
        You can unsubscribe at any time by clicking the unsubscribe link in any of our emails.
      </p>
    </div>
  `;
}

/**
 * Scholarship Application Reminder Email
 */
export function generateScholarshipDeadlineReminderTemplate(scholarship) {
  const deadlineDate = new Date(scholarship.closingDate).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ff6b6b;">Application Deadline Approaching</h2>
      <div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:20px 0;">
        <h3 style="color:#667eea;margin:0 0 10px 0;">${scholarship.scholarshipName}</h3>
        <p style="margin:5px 0;"><strong>University:</strong> ${scholarship.university}</p>
        <p style="margin:5px 0;"><strong>Deadline:</strong> <span style="color:#ff6b6b;">${deadlineDate}</span></p>
      </div>
      <p style="color:#555;">Don't miss this opportunity! Make sure to submit your application before the deadline.</p>
      ${scholarship.sourceUrl ? `<a href="${scholarship.sourceUrl}" style="display:inline-block;padding:12px 24px;background:#667eea;color:#fff;text-decoration:none;border-radius:5px;margin-top:15px;">Apply Now</a>` : ''}
    </div>
  `;
}

/**
 * New Scholarship Posted Email
 */
export function generateNewScholarshipTemplate(scholarship) {
  const deadlineDate = scholarship.deadline 
    ? new Date(scholarship.deadline).toLocaleDateString('en-NP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">New Scholarship Opportunity</h2>
      <div style="background:#f0fdf4;padding:15px;border-radius:5px;margin:20px 0;border-left:4px solid #10b981;">
        <h3 style="color:#222;margin:0 0 10px 0;">${scholarship.title}</h3>
        <p style="margin:5px 0;"><strong>University:</strong> ${scholarship.university}</p>
        <p style="margin:5px 0;"><strong>Level:</strong> ${scholarship.level}</p>
        <p style="margin:5px 0;"><strong>Country:</strong> ${scholarship.country}</p>
        <p style="margin:5px 0;"><strong>Application Deadline:</strong> ${deadlineDate}</p>
      </div>
      ${scholarship.description ? `<p style="color:#555;line-height:1.6;">${scholarship.description}</p>` : ''}
      ${scholarship.link ? `<a href="${scholarship.link}" style="display:inline-block;padding:12px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:5px;margin-top:15px;">View Details</a>` : ''}
    </div>
  `;
}