"use client";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { SiLinkedin, SiMaildotru } from "react-icons/si";
import { MdAccessTime, MdArrowForward, MdEdit, MdLocationOn } from "react-icons/md";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { useEntranceStagger, useIsMobile } from "@lib/hooks";

interface ContactSectionProps {
  inquiryData?: { plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean } | null;
}

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(function ContactSection({ inquiryData }, ref) {
  const isMobile = useIsMobile();
  const entranceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { amount: 0.3, once: true });
  useEntranceStagger(entranceRef, { baseDelay: 40, step: 80 });

  const [isTyping, setIsTyping] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const typeTimer = useRef<NodeJS.Timeout | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!inquiryData || !isInView) {
      setMessageBody("");
      setIsTyping(false);
      setSenderEmail("");
      if (typeTimer.current) clearInterval(typeTimer.current);
      return;
    }

    const body = `Hi Max,\n\nI'm interested in starting a project with you.\n\nMy Selection:\n• Build Plan: ${inquiryData.plan || "Not selected"}\n• Monthly Support: ${inquiryData.subscription ? "Yes, Peace of Mind Plan" : "No thanks"}\n\n[Please describe your project here...]`;
    if (typeTimer.current) clearInterval(typeTimer.current);
    setIsTyping(true);
    setMessageBody("");

    let i = 0;
    const delay = isMobile ? 12 : 8;
    typeTimer.current = setInterval(() => {
      i += 1;
      setMessageBody(body.slice(0, i));
      if (i >= body.length) {
        if (typeTimer.current) clearInterval(typeTimer.current);
        typeTimer.current = null;
        setIsTyping(false);
      }
    }, delay);

    return () => {
      if (typeTimer.current) clearInterval(typeTimer.current);
      typeTimer.current = null;
    };
  }, [inquiryData, isInView, isMobile]);

  const handleSend = async () => {
    if (submitState === "sending") return;
    if (!senderEmail || !/\S+@\S+\.\S+/.test(senderEmail)) {
      setSubmitState("error");
      setSubmitError("Please enter a valid email so I can reply.");
      return;
    }
    if (!messageBody.trim()) {
      setSubmitState("error");
      setSubmitError("Please add a short message before sending.");
      return;
    }
    setSubmitState("sending");
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageBody,
          plan: inquiryData?.plan ?? null,
          subscription: inquiryData?.subscription ?? false,
          email: senderEmail.trim(),
          honey: "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }
      setSubmitState("sent");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(err instanceof Error ? err.message : "Failed to send");
    }
  };

  return (
    <section ref={ref} id="contact" className="section contact-section">
      <div ref={entranceRef} data-entrance="contact" className="contact-cockpit">
        <div className="cockpit-header contact-cockpit-header" data-entrance-item>
          <div className="contact-heading">
            <p className="hero-eyebrow">Contact</p>
            <h2>Let&apos;s build something sharp.</h2>
          </div>
          <p>Have a project in mind, a half-formed idea, or just want to see if there&apos;s a fit? Start here.</p>
        </div>

        <div ref={contentRef} className="contact-panel" data-entrance-item>
          <AnimatePresence mode="wait">
            {!inquiryData ? (
              <motion.div
                key="contact-links"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="contact-link-panel"
              >
                <div className="contact-pitch">
                  <span aria-hidden="true" className="contact-pitch-rule" />
                  <h3>Quick, direct, no weird form maze.</h3>
                  <p>Send the essentials and I&apos;ll reply with next steps, timelines, and a clean recommendation for the build.</p>
                </div>

                <div className="contact-channel-card" aria-label="Direct channels">
                  <a className="contact-channel" href={`mailto:${CONTACT_EMAIL}`}>
                    <span className="contact-channel-icon"><SiMaildotru aria-hidden="true" /></span>
                    <span className="contact-channel-copy">
                      <span className="contact-channel-label">Email</span>
                      <span className="contact-channel-value">{CONTACT_EMAIL}</span>
                    </span>
                    <MdArrowForward className="contact-channel-arrow" aria-hidden="true" />
                  </a>
                  <a className="contact-channel" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                    <span className="contact-channel-icon"><SiLinkedin aria-hidden="true" /></span>
                    <span className="contact-channel-copy">
                      <span className="contact-channel-label">Professional</span>
                      <span className="contact-channel-value">LinkedIn</span>
                    </span>
                    <MdArrowForward className="contact-channel-arrow" aria-hidden="true" />
                  </a>
                  <div className="contact-meta-row" aria-label="Contact details">
                    <span><MdAccessTime aria-hidden="true" /> <span>Typical reply:</span> <strong>within one business day</strong></span>
                    <span><MdLocationOn aria-hidden="true" /> <strong>Medford, Oregon</strong></span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="contact-form-panel"
              >
                <div className="contact-form-shell">
                  <div className="contact-form-header">
                    <span><MdEdit size={14} /> Message Body</span>
                    <span>{isTyping ? "Auto-filling..." : "Editable"}</span>
                  </div>
                  <textarea
                    value={messageBody}
                    onChange={(e) => {
                      if (typeTimer.current) clearInterval(typeTimer.current);
                      typeTimer.current = null;
                      setIsTyping(false);
                      setMessageBody(e.target.value);
                    }}
                    spellCheck={false}
                  />
                  <input
                    id="sender-email"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Your email so I can reply"
                  />
                  {submitState === "sent" && <p className="contact-status success">Sent! I&apos;ll reply soon.</p>}
                  {submitState === "error" && submitError && <p className="contact-status error">Error: {submitError}</p>}
                </div>
                <button onClick={handleSend} disabled={isTyping || submitState === "sending"} className="contact-send-button">
                  {submitState === "sending" ? "Sending..." : submitState === "sent" ? "Sent" : "Send Now"} <MdArrowForward />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
