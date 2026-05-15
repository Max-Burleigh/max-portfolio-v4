"use client";
import React, { forwardRef, useRef } from "react";
import { SiLinkedin } from "react-icons/si";
import {
  MdAccessTime,
  MdAlternateEmail,
  MdArrowForward,
  MdChatBubbleOutline,
  MdCode,
  MdGpsFixed,
  MdLocationOn,
  MdRocketLaunch,
} from "react-icons/md";
import { motion } from "framer-motion";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { useEntranceStagger } from "@lib/hooks";

const contactPromises = [
  { icon: MdChatBubbleOutline, label: "Clear communication" },
  { icon: MdGpsFixed, label: "Focused solutions" },
  { icon: MdCode, label: "Clean execution" },
  { icon: MdRocketLaunch, label: "On-time delivery" },
] as const;

const ContactSection = forwardRef<HTMLDivElement, object>(function ContactSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 40, step: 80 });

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

        <div className="contact-panel" data-entrance-item>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-link-panel"
          >
            <div className="contact-pitch">
              <span aria-hidden="true" className="contact-pitch-rule" />
              <h3>Need support or a new build?</h3>
              <p>Tell me what&apos;s broken, what you want to launch, and your deadline. I&apos;ll give you the roadmap.</p>
              <div className="contact-promise-grid" aria-label="Working style">
                {contactPromises.map(({ icon: Icon, label }, index) => (
                  <div
                    className="contact-promise"
                    key={label}
                    style={{ "--promise-delay": `${index * -3}s` } as React.CSSProperties}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                ))}
                <div className="contact-promise-dots" aria-hidden="true">
                  {contactPromises.map(({ label }, index) => (
                    <span
                      className="contact-promise-dot"
                      key={`${label}-dot`}
                      style={{ "--promise-delay": `${index * -3}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-channel-card" aria-label="Direct channels">
              <a className="contact-channel" href={`mailto:${CONTACT_EMAIL}`}>
                <span className="contact-channel-icon"><MdAlternateEmail aria-hidden="true" /></span>
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
                <span><MdAccessTime aria-hidden="true" /> <span>Typical reply:</span> <strong>one to two business days</strong></span>
                <span><MdLocationOn aria-hidden="true" /> <strong>Medford, Oregon</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
