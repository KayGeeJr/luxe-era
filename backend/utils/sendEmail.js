const nodemailer = require("nodemailer");

const STORE_NAME = process.env.STORE_NAME || "Store";
const STORE_URL = process.env.FRONTEND_URL || "https://example.com";

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `${STORE_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

function baseLayout(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${STORE_NAME}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
        <!-- Header -->
        <tr><td style="background:#171717;padding:28px 32px;text-align:center;">
          <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.12em;">${STORE_NAME}</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#fafafa;border-top:1px solid #e5e5e5;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#a3a3a3;">${STORE_NAME} &middot; <a href="${STORE_URL}" style="color:#a3a3a3;text-decoration:none;">${STORE_URL.replace(/^https?:\/\//, "")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text, url) {
  return `<a href="${url}" style="display:inline-block;background:#171717;color:#ffffff;padding:12px 28px;border-radius:9999px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;">${text}</a>`;
}

function welcomeEmail(name = "there") {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">Welcome to ${STORE_NAME}</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#525252;line-height:1.6;">Hi ${escapeHtml(name)}, thanks for creating an account.</p>
    <p style="margin:0 0 24px;font-size:14px;color:#737373;line-height:1.6;">Explore our latest collections and find something you love.</p>
    <p style="text-align:center;">${btn("Shop Now", `${STORE_URL}/shop`)}</p>
  `);
}

function orderConfirmationEmail(order) {
  const itemRows = (order?.items || []).map(item => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#171717;border-bottom:1px solid #f5f5f5;">${escapeHtml(item.productName || "")}${item.variantSize ? ` <span style="color:#a3a3a3;font-size:12px;">(${escapeHtml(item.variantSize)}${item.variantColour ? ` / ${escapeHtml(item.variantColour)}` : ""})</span>` : ""}</td>
      <td style="padding:10px 0;font-size:14px;color:#525252;text-align:center;border-bottom:1px solid #f5f5f5;">×${item.quantity}</td>
      <td style="padding:10px 0;font-size:14px;color:#171717;text-align:right;font-weight:600;border-bottom:1px solid #f5f5f5;">R${((item.price * item.quantity) / 100).toFixed(2)}</td>
    </tr>
  `).join("");

  const total = order?.total ? `R${(order.total / 100).toFixed(2)}` : "";

  return baseLayout(`
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#171717;">Order confirmed</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#737373;">Order <strong style="color:#171717;">${escapeHtml(order?.orderNumber || "")}</strong></p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <thead>
        <tr>
          <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;text-align:left;border-bottom:1px solid #e5e5e5;">Item</th>
          <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;text-align:center;border-bottom:1px solid #e5e5e5;">Qty</th>
          <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#a3a3a3;text-align:right;border-bottom:1px solid #e5e5e5;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    ${total ? `<p style="text-align:right;font-size:15px;font-weight:700;color:#171717;margin:0 0 24px;">Total: ${total}</p>` : ""}

    <p style="font-size:14px;color:#525252;line-height:1.6;margin:0 0 24px;">We'll email you again when your order ships. If you have any questions, reply to this email.</p>
    <p style="text-align:center;">${btn("View Order", `${STORE_URL}/checkout/success?custom_str1=${encodeURIComponent(order?.orderNumber || "")}`)}</p>
  `);
}

function orderShippedEmail(order) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">Your order is on its way!</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#737373;">Order <strong style="color:#171717;">${escapeHtml(order?.orderNumber || "")}</strong></p>
    ${order?.trackingNumber ? `<p style="margin:0 0 16px;font-size:14px;color:#525252;">Tracking number: <strong style="color:#171717;">${escapeHtml(order.trackingNumber)}</strong></p>` : ""}
    <p style="font-size:14px;color:#525252;line-height:1.6;margin:0 0 4px;">Your order has been handed to our courier and is on its way to you.</p>
  `);
}

function adminNewOrderEmail(order) {
  const total = order?.total ? `R${(order.total / 100).toFixed(2)}` : "";
  const customer = order?.guestEmail || "Logged-in user";
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">New order received</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#737373;">Order <strong style="color:#171717;">${escapeHtml(order?.orderNumber || "")}</strong></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${[["Customer", customer], ["Total", total], ["Items", (order?.items || []).length]].map(([label, val]) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#a3a3a3;border-bottom:1px solid #f5f5f5;">${label}</td>
          <td style="padding:8px 0;font-size:14px;color:#171717;font-weight:600;text-align:right;border-bottom:1px solid #f5f5f5;">${escapeHtml(String(val))}</td>
        </tr>
      `).join("")}
    </table>
    <p style="text-align:center;">${btn("Manage Order", `${STORE_URL}/admin`)}</p>
  `);
}

function resetPasswordEmail(name = "there", resetUrl) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">Reset your password</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#525252;line-height:1.6;">Hi ${escapeHtml(name)}, we received a request to reset your ${STORE_NAME} password. Click below to set a new one — this link expires in <strong>1 hour</strong>.</p>
    <p style="text-align:center;margin:0 0 24px;">${btn("Reset Password", resetUrl)}</p>
    <p style="font-size:13px;color:#a3a3a3;line-height:1.6;">If you didn't request this, you can safely ignore this email.</p>
  `);
}

function customOrderConfirmationEmail(inquiry) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">Custom order received</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#525252;line-height:1.6;">Hi ${escapeHtml(inquiry?.name || "there")}, thanks for your custom order request. We've received it and will be in touch shortly.</p>
    <p style="font-size:14px;color:#737373;line-height:1.6;margin:0;">If you have any questions, reply to this email.</p>
  `);
}

function adminCustomOrderEmail(inquiry) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#171717;">New custom order inquiry</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#525252;">From: <strong>${escapeHtml(inquiry?.name || "a customer")}</strong>${inquiry?.email ? ` &lt;${escapeHtml(inquiry.email)}&gt;` : ""}</p>
    ${inquiry?.message ? `<p style="font-size:14px;color:#525252;line-height:1.6;margin:0 0 16px;background:#fafafa;padding:16px;border-radius:8px;border:1px solid #e5e5e5;">${escapeHtml(inquiry.message)}</p>` : ""}
    <p style="text-align:center;">${btn("View Admin", `${STORE_URL}/admin`)}</p>
  `);
}

module.exports = {
  sendEmail,
  welcomeEmail,
  orderConfirmationEmail,
  orderShippedEmail,
  adminNewOrderEmail,
  resetPasswordEmail,
  customOrderConfirmationEmail,
  adminCustomOrderEmail,
};
