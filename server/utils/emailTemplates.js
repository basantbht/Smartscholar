export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;
}

/**
 * Request Accepted Email
 */
export function generateRequestAcceptedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">Supervisor Request Accepted</h2>
      <p>Your supervisor request has been accepted by <strong>${supervisorName}</strong>.</p>
      <p>You can now start working on your project and upload files.</p>
    </div>
  `;
}

/**
 * Request Rejected Email
 */
export function generateRequestRejectedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">Supervisor Request Rejected</h2>
      <p>Your supervisor request has been rejected by <strong>${supervisorName}</strong>.</p>
      <p>You can try requesting another supervisor.</p>
    </div>
  `;
}

/**
 * Request Accepted Email with Event Details
 */
export function generateRequestAcceptedTemplate(supervisorName, eventName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">Event Application Approved</h2>
      <p>Great news! Your application for <strong>${eventName || 'the event'}</strong> has been approved by <strong>${supervisorName}</strong>.</p>
      <p>We look forward to seeing you at the event!</p>
    </div>
  `;
}

/**
 * Request Rejected Email with Event Details
 */
export function generateRequestRejectedTemplate(supervisorName, eventName, rejectionReason) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">Event Application Rejected</h2>
      <p>Unfortunately, your application for <strong>${eventName || 'the event'}</strong> has been rejected by <strong>${supervisorName}</strong>.</p>
      ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
      <p>You can explore other events and apply again.</p>
    </div>
  `;
}