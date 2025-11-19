"use client";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { SiLinkedin, SiMaildotru } from "react-icons/si";
import { MdArrowForward, MdTerminal, MdEdit } from "react-icons/md";
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

  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [messageBody, setMessageBody] = useState("");

  // Trigger sequence start when in view and data is present
  useEffect(() => {
    if (inquiryData && isInView && !sequenceStarted) {
      setSequenceStarted(true);
    } else if (!inquiryData) {
      setSequenceStarted(false);
      setLines([]);
      setShowForm(false);
    }
  }, [inquiryData, isInView, sequenceStarted]);

  // Run animation sequence
  useEffect(() => {
    if (!sequenceStarted || !inquiryData) return;

    const planName = inquiryData.plan === "ESSENTIAL" ? "Essential Plan" : (inquiryData.plan === "GROWTH" ? "Growth Plan" : "Custom Project");
    const subText = inquiryData.subscription ? "Peace of Mind Subscription" : "None";
    
    const body = `Hi Max,

I'm interested in starting a project with you.

My Selection:
• Build Plan: ${inquiryData.plan || "Not selected"}
• Monthly Support: ${inquiryData.subscription ? "Yes, Peace of Mind Plan" : "No thanks"}

[Please describe your project here...]`;
    setMessageBody(body);
    setLines([]);
    setShowForm(false);

    const mobileDelay = isMobile ? 1200 : 0;
    const stepMultiplier = isMobile ? 1.5 : 1;

    const sequence = [
      { text: "> Initializing project request...", delay: 100 + mobileDelay },
      { text: `> Selected Plan: ${planName}`, delay: 800 * stepMultiplier + mobileDelay },
      { text: `> Add-ons: ${subText}`, delay: 1500 * stepMultiplier + mobileDelay },
      { text: "> Generative draft initialized.", delay: 2200 * stepMultiplier + mobileDelay },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const finalT = setTimeout(() => {
      setShowForm(true);
    }, 2800 * stepMultiplier + mobileDelay);
    timeouts.push(finalT);

    return () => timeouts.forEach(clearTimeout);
  }, [sequenceStarted, inquiryData, isMobile]); // inquiryData included to satisfy linter, but sequenceStarted is the main trigger

  const handleLaunchEmail = () => {
    const subject = `Project Inquiry: ${inquiryData?.plan ? inquiryData.plan.charAt(0) + inquiryData.plan.slice(1).toLowerCase() + " Plan" : "Custom Project"}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
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
                <AnimatePresence mode={isMobile ? "wait" : undefined}>
                  {(!isMobile || !showForm) && (
                    <motion.div 
                      key="system-output"
                      className="rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-8"
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                      {/* Terminal Header */}
                      <div className="bg-white/5 border-b border-white/10 p-3 flex items-center gap-3">
                        <MdTerminal className="text-teal-400" size={16} />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/60 font-space-grotesk">System Output</span>
                      </div>
                      
                      <div className="p-5">
                        <div className="font-mono text-sm space-y-2 text-teal-300/90 min-h-[80px]">
                          {lines.map((line, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              {line}
                            </motion.div>
                          ))}
                          {lines.length < 4 && (
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="w-1.5 h-3 bg-teal-500/50 inline-block align-middle ml-1"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {showForm && (
                    <motion.div
                      key="contact-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6 focus-within:border-teal-500/50 transition-colors">
                        <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-white/5">
                          <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                            <MdEdit size={14} /> Message Body
                          </span>
                          <span className="text-[10px] text-white/20 uppercase tracking-wider">Editable</span>
                        </div>
                        <textarea
                          value={messageBody}
                          onChange={(e) => setMessageBody(e.target.value)}
                          className="w-full h-72 md:h-96 bg-transparent p-4 text-white/80 text-sm resize-none focus:outline-none font-mono leading-relaxed"
                          spellCheck={false}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleLaunchEmail}
                          className="w-full md:w-auto bg-teal-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                        >
                          Send Now <MdArrowForward />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <SiMaildotru className="w-[22px] h-[22px] flex-shrink-0 mr-2 text-blue-500 group-hover:text-blue-400 transition-colors" />
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
