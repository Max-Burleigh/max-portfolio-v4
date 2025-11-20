import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const resendTo = process.env.RESEND_TO;

export async function POST(req: Request) {
  if (!resendApiKey || !resendTo) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const { message, email, plan, subscription, honey } = await req.json().catch(() => ({}));

  if (typeof honey === "string" && honey.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  const safeEmail = typeof email === "string" && /\S+@\S+\.\S+/.test(email) ? email.trim() : null;
  if (!safeEmail) {
    return NextResponse.json({ error: "Reply email is required" }, { status: 400 });
  }
  const planLabel =
    plan === "ESSENTIAL" ? "Essential" : plan === "GROWTH" ? "Growth" : "Custom/Not selected";
  const subLabel = subscription ? "Yes (Peace of Mind)" : "No";

  const body = [
    `Plan: ${planLabel}`,
    `Subscription: ${subLabel}`,
    `Reply-to (user provided): ${safeEmail}`,
    "",
    message.trim(),
  ].join("\n");

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      subject: `Project Inquiry: ${planLabel}`,
      text: body,
      reply_to: safeEmail,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
