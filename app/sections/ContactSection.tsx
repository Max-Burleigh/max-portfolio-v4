"use client";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { SiLinkedin, SiMaildotru } from "react-icons/si";
import { MdArrowForward, MdEdit } from "react-icons/md";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { useEntranceStagger, useIsMobile } from "@lib/hooks";

interface ContactSectionProps {
  inquiryData?: { plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean } | null;
}

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(function ContactSection({ inquiryData }, ref) {
  const isMobile = useIsMobile();
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 40, step: 90 });

  // Track visibility for animation trigger
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { amount: 0.3, once: true });

  const [isTyping, setIsTyping] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const typeTimer = useRef<NodeJS.Timeout | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Start typewriter when inquiry data arrives and section is visible
  useEffect(() => {
    if (!inquiryData || !isInView) {
      setMessageBody("");
      setIsTyping(false);
      if (typeTimer.current) clearInterval(typeTimer.current);
      return;
    }

    const planName = inquiryData.plan === "ESSENTIAL" ? "Essential Plan" : (inquiryData.plan === "GROWTH" ? "Growth Plan" : "Custom Project");
    const subText = inquiryData.subscription ? "Peace of Mind Subscription" : "None";

    const body = `Hi Max,

I'm interested in starting a project with you.

My Selection:
• Build Plan: ${inquiryData.plan || "Not selected"}
• Monthly Support: ${inquiryData.subscription ? "Yes, Peace of Mind Plan" : "No thanks"}

[Please describe your project here...]`;
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
      <div ref={entranceRef} data-entrance="contact" className="w-full max-w-4xl mx-auto transition-all duration-500">
        <div 
          ref={contentRef}
          className="glass-card contact-card transition-all duration-500 ease-in-out overflow-hidden mx-auto"
          style={{ maxWidth: inquiryData ? "800px" : "550px", width: "100%" }}
        >
          <h2 data-entrance-item>Contact</h2>
          
          <AnimatePresence mode="wait">
            {!inquiryData ? (
              <motion.p 
                key="intro"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-left mt-6" 
                data-entrance-item
              >
                Feel free to reach out if you have a project in mind or just want to chat!
              </motion.p>
            ) : (
              <motion.div
                key="inquiry-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-6 focus-within:border-teal-500/50 transition-colors">
                    <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <span className="text-xs text-teal-300 font-semibold flex items-center gap-2">
                        <MdEdit size={14} /> Message Body
                      </span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                        {isTyping ? "Auto-filling..." : "Editable"}
                      </span>
                    </div>
                    <div className="p-4">
                      <textarea
                        value={messageBody}
                        onChange={(e) => {
                          if (typeTimer.current) clearInterval(typeTimer.current);
                          typeTimer.current = null;
                          setIsTyping(false);
                          setMessageBody(e.target.value);
                        }}
                        className="w-full h-72 md:h-96 bg-transparent p-4 text-white/85 text-sm resize-none focus:outline-none font-mono leading-relaxed rounded-lg border border-white/5"
                        spellCheck={false}
                      />
                      {isTyping && (
                        <div className="mt-2 text-[11px] text-teal-300/80 font-mono flex items-center gap-2">
                          <motion.span
                            className="inline-block w-2 h-2 rounded-full bg-teal-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                          />
                          Generating your draft...
                        </div>
                      )}
                      {submitState === "sent" && (
                        <div className="mt-2 text-[11px] text-teal-300 font-semibold">Sent! Check your inbox.</div>
                      )}
                      {submitState === "error" && submitError && (
                        <div className="mt-2 text-[11px] text-red-300 font-semibold">Error: {submitError}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSend}
                      disabled={isTyping || submitState === "sending"}
                      className="w-full md:w-auto bg-teal-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {submitState === "sending" ? "Sending..." : submitState === "sent" ? "Sent" : "Send Now"} <MdArrowForward />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-left space-y-4 pt-8 border-t border-white/10" data-entrance-item>
             {/* Keep contact links always available */}
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-space-grotesk mb-4">
              Direct Channels
            </p>
            <div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center hover:text-teal-300 transition-colors group"
              >
                <SiMaildotru className="w-[22px] h-[22px] flex-shrink-0 mr-2 text-teal-300 group-hover:text-teal-200 transition-colors" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
            <div>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors font-medium"
              >
                <SiLinkedin className="w-[22px] h-[22px] flex-shrink-0 mr-2" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
