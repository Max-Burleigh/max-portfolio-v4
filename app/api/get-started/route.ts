import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const resendTo = process.env.RESEND_TO;

interface Attachment {
  filename: string;
  content: string; // base64
  type: string;
}

interface FormData {
  businessName: string;
  websiteUrl?: string;
  businessDescription?: string;
  mainGoal?: string;
  timeline?: string;
  colorPalette?: string;
  customColors?: string[];
  inspirationUrl?: string;
  name: string;
  email: string;
  plan?: "ESSENTIAL" | "GROWTH" | null;
  support?: boolean;
  attachments?: Attachment[];
}

const GOAL_LABELS: Record<string, string> = {
  contact: "Get people to contact me",
  book: "Book appointments/calls",
  buy: "Sell products or services",
  learn: "Learn about my business",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1-2months": "1-2 months",
  "3+months": "3+ months",
  exploring: "Just exploring",
};

const PALETTE_LABELS: Record<string, string> = {
  // Blues & Teals
  ocean: "Ocean",
  arctic: "Arctic",
  midnight: "Midnight",
  // Warm tones
  sunset: "Sunset",
  autumn: "Autumn",
  terracotta: "Terracotta",
  coral: "Coral",
  // Greens
  forest: "Forest",
  mint: "Mint",
  sage: "Sage",
  emerald: "Emerald",
  // Purples
  royal: "Royal",
  lavender: "Lavender",
  grape: "Grape",
  amethyst: "Amethyst",
  // Pinks
  rose: "Rose",
  blush: "Blush",
  fuchsia: "Fuchsia",
  // Neutrals
  mono: "Monochrome",
  slate: "Slate",
  "warm-gray": "Warm Gray",
  noir: "Noir",
  // Vibrant
  neon: "Neon",
  electric: "Electric",
  pop: "Pop Art",
  candy: "Candy",
  // Earth
  earth: "Earth",
  clay: "Clay",
  sand: "Sand",
  coffee: "Coffee",
};

// Get palette colors for email display
const PALETTE_COLORS: Record<string, string[]> = {
  ocean: ["#0ea5e9", "#06b6d4", "#14b8a6", "#1e293b"],
  arctic: ["#38bdf8", "#7dd3fc", "#e0f2fe", "#0c4a6e"],
  midnight: ["#1e3a5f", "#3b82f6", "#93c5fd", "#0f172a"],
  sunset: ["#f97316", "#ef4444", "#ec4899", "#1f2937"],
  autumn: ["#dc2626", "#ea580c", "#d97706", "#292524"],
  terracotta: ["#c2410c", "#fb923c", "#fef3c7", "#431407"],
  coral: ["#fb7185", "#f472b6", "#fbbf24", "#18181b"],
  forest: ["#22c55e", "#16a34a", "#84cc16", "#1a2e1a"],
  mint: ["#34d399", "#6ee7b7", "#d1fae5", "#064e3b"],
  sage: ["#84cc16", "#a3e635", "#ecfccb", "#365314"],
  emerald: ["#059669", "#10b981", "#6ee7b7", "#022c22"],
  royal: ["#8b5cf6", "#6366f1", "#a855f7", "#1e1b4b"],
  lavender: ["#a78bfa", "#c4b5fd", "#ede9fe", "#2e1065"],
  grape: ["#7c3aed", "#8b5cf6", "#c4b5fd", "#1e1b4b"],
  amethyst: ["#9333ea", "#a855f7", "#e9d5ff", "#3b0764"],
  rose: ["#f43f5e", "#fb7185", "#fecdd3", "#4c0519"],
  blush: ["#ec4899", "#f472b6", "#fce7f3", "#500724"],
  fuchsia: ["#c026d3", "#e879f9", "#fae8ff", "#4a044e"],
  mono: ["#f8fafc", "#64748b", "#334155", "#0f172a"],
  slate: ["#475569", "#94a3b8", "#e2e8f0", "#0f172a"],
  "warm-gray": ["#78716c", "#a8a29e", "#f5f5f4", "#1c1917"],
  noir: ["#18181b", "#3f3f46", "#a1a1aa", "#fafafa"],
  neon: ["#22d3ee", "#a855f7", "#f472b6", "#0f0f0f"],
  electric: ["#3b82f6", "#8b5cf6", "#ec4899", "#111827"],
  pop: ["#facc15", "#ef4444", "#3b82f6", "#fafafa"],
  candy: ["#f472b6", "#fb923c", "#facc15", "#fef3c7"],
  earth: ["#92400e", "#b45309", "#fbbf24", "#fef3c7"],
  clay: ["#78350f", "#a16207", "#d97706", "#fffbeb"],
  sand: ["#d6d3d1", "#a8a29e", "#78716c", "#292524"],
  coffee: ["#78350f", "#92400e", "#fef3c7", "#1c1917"],
};

export async function POST(req: Request) {
  if (!resendApiKey || !resendTo) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let data: FormData;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    businessName,
    websiteUrl,
    businessDescription,
    mainGoal,
    timeline,
    colorPalette,
    customColors,
    inspirationUrl,
    name,
    email,
    plan,
    support,
    attachments,
  } = data;

  // Validation
  if (!businessName || typeof businessName !== "string" || businessName.trim().length < 1) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Format plan info
  const planLabel = plan === "ESSENTIAL" ? "Essential" : plan === "GROWTH" ? "Growth" : "Not selected";
  const supportLabel = support ? "Yes" : "No";

  // Format color preference
  const colorInfo = colorPalette
    ? PALETTE_LABELS[colorPalette] || colorPalette
    : customColors && customColors.length > 0
      ? `Custom: ${customColors.join(", ")}`
      : null;

  // Build email body
  const sections = [
    `# New Project Brief`,
    ``,
    `## Selection`,
    `- **Plan:** ${planLabel}`,
    `- **Peace of Mind Support:** ${supportLabel}`,
    ``,
    `## About the Project`,
    `- **Business Name:** ${businessName.trim()}`,
    websiteUrl ? `- **Current Website:** ${websiteUrl.trim()}` : null,
    businessDescription ? `- **Business Description:** ${businessDescription.trim()}` : null,
    mainGoal ? `- **Main Goal:** ${GOAL_LABELS[mainGoal] || mainGoal}` : null,
    ``,
    `## Preferences`,
    timeline ? `- **Timeline:** ${TIMELINE_LABELS[timeline] || timeline}` : null,
    colorInfo ? `- **Color Preference:** ${colorInfo}` : null,
    inspirationUrl ? `- **Inspiration Site:** ${inspirationUrl.trim()}` : null,
    ``,
    `## Contact Info`,
    `- **Name:** ${name.trim()}`,
    `- **Email:** ${email.trim()}`,
    ``,
    attachments && attachments.length > 0 ? `## Attachments` : null,
    attachments && attachments.length > 0 ? `${attachments.length} file(s) attached` : null,
  ].filter(Boolean).join("\n");

  // Plain text version
  const plainText = sections
    .replace(/^# /gm, "")
    .replace(/^## /gm, "\n")
    .replace(/\*\*/g, "");

  // Get palette colors for display
  const paletteColors = colorPalette ? PALETTE_COLORS[colorPalette] : null;
  const displayColors = customColors && customColors.length > 0 ? customColors : paletteColors;

  // HTML version - beautifully designed
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #14b8a6; letter-spacing: -0.5px;">
        New Project Brief
      </h1>
      <p style="margin: 0; color: #94a3b8; font-size: 14px;">
        ${escapeHtml(businessName.trim())} • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>

    <!-- Quick Stats Banner -->
    <div style="background: linear-gradient(135deg, ${plan === "GROWTH" ? "#7c3aed20" : "#14b8a620"} 0%, ${plan === "GROWTH" ? "#6366f115" : "#0d948815"} 100%); border: 1px solid ${plan === "GROWTH" ? "#7c3aed40" : "#14b8a640"}; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <div style="display: inline-block; margin: 0 12px;">
        <span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; background: ${plan === "GROWTH" ? "#7c3aed" : "#14b8a6"}; color: white;">
          ${planLabel} Plan
        </span>
      </div>
      ${support ? `
      <div style="display: inline-block; margin: 0 12px;">
        <span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; background: #475569; color: white;">
          ✓ Peace of Mind
        </span>
      </div>
      ` : ""}
    </div>

    <!-- Client Info Card -->
    <div style="background: #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
      <h2 style="margin: 0 0 20px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">
        📋 Client Details
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top; width: 140px;">
            <span style="color: #64748b; font-size: 13px;">Contact</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <strong style="color: #f8fafc; font-size: 15px;">${escapeHtml(name.trim())}</strong><br>
            <a href="mailto:${escapeHtml(email.trim())}" style="color: #14b8a6; text-decoration: none; font-size: 14px;">${escapeHtml(email.trim())}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <span style="color: #64748b; font-size: 13px;">Business</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <strong style="color: #f8fafc; font-size: 15px;">${escapeHtml(businessName.trim())}</strong>
            ${websiteUrl ? `<br><a href="${escapeHtml(websiteUrl.trim())}" style="color: #38bdf8; text-decoration: none; font-size: 13px;">${escapeHtml(websiteUrl.trim())}</a>` : ""}
          </td>
        </tr>
        ${businessDescription ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <span style="color: #64748b; font-size: 13px;">Description</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <span style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">${escapeHtml(businessDescription.trim())}</span>
          </td>
        </tr>
        ` : ""}
        ${mainGoal ? `
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <span style="color: #64748b; font-size: 13px;">Primary Goal</span>
          </td>
          <td style="padding: 12px 0; vertical-align: top;">
            <span style="display: inline-block; padding: 4px 12px; background: #0f172a; border-radius: 6px; color: #f8fafc; font-size: 14px; font-weight: 500;">${escapeHtml(GOAL_LABELS[mainGoal] || mainGoal)}</span>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>

    <!-- Preferences Card -->
    <div style="background: #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
      <h2 style="margin: 0 0 20px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">
        🎨 Project Preferences
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        ${timeline ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top; width: 140px;">
            <span style="color: #64748b; font-size: 13px;">Timeline</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #334155; vertical-align: top;">
            <span style="display: inline-block; padding: 4px 12px; background: #0f172a; border-radius: 6px; color: #fbbf24; font-size: 14px; font-weight: 500;">${escapeHtml(TIMELINE_LABELS[timeline] || timeline)}</span>
          </td>
        </tr>
        ` : ""}
        ${displayColors ? `
        <tr>
          <td style="padding: 12px 0; ${inspirationUrl ? "border-bottom: 1px solid #334155;" : ""} vertical-align: top;">
            <span style="color: #64748b; font-size: 13px;">Colors</span>
          </td>
          <td style="padding: 12px 0; ${inspirationUrl ? "border-bottom: 1px solid #334155;" : ""} vertical-align: top;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${displayColors.map(c => `<span style="display: inline-block; width: 28px; height: 28px; border-radius: 6px; background: ${escapeHtml(c)}; border: 2px solid #334155;"></span>`).join("")}
              <span style="color: #94a3b8; font-size: 13px; margin-left: 8px;">${colorPalette ? escapeHtml(PALETTE_LABELS[colorPalette] || colorPalette) : "Custom"}</span>
            </div>
          </td>
        </tr>
        ` : ""}
        ${inspirationUrl ? `
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <span style="color: #64748b; font-size: 13px;">Inspiration</span>
          </td>
          <td style="padding: 12px 0; vertical-align: top;">
            <a href="${escapeHtml(inspirationUrl.trim())}" style="color: #38bdf8; text-decoration: none; font-size: 14px;">${escapeHtml(inspirationUrl.trim())}</a>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>

    ${attachments && attachments.length > 0 ? `
    <!-- Attachments Card -->
    <div style="background: #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
      <h2 style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">
        📎 Attachments
      </h2>
      <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
        ${attachments.length} file${attachments.length > 1 ? "s" : ""} attached to this email
      </p>
    </div>
    ` : ""}

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #334155;">
      <p style="margin: 0; color: #475569; font-size: 12px;">
        Sent from your portfolio intake form
      </p>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const resend = new Resend(resendApiKey);

    // Prepare attachments for Resend
    const emailAttachments = attachments?.map((att) => ({
      filename: att.filename,
      content: att.content, // base64 string
    })) || [];

    await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      subject: `Project Brief: ${businessName.trim()} (${planLabel})`,
      text: plainText,
      html: htmlBody,
      reply_to: email.trim(),
      attachments: emailAttachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
