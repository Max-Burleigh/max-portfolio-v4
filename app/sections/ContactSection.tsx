"use client";
import React, { forwardRef, useRef } from "react";
import { SiLinkedin } from "react-icons/si";
import {
  MdAccessTime,
  MdAlternateEmail,
  MdArrowForward,
  MdLocationOn,
} from "react-icons/md";
import { motion } from "framer-motion";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { useEntranceStagger } from "@lib/hooks";

const ContactSection = forwardRef<HTMLDivElement, object>(function ContactSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 40, step: 80 });

  return (
    <section ref={ref} id="contact" className="section contact-section">
      <div ref={entranceRef} data-entrance="contact" className="contact-cockpit">
        <div className="cockpit-header contact-cockpit-header contact-cockpit-header-simple" data-entrance-item>
          <div className="contact-heading">
            <p className="hero-eyebrow">Contact</p>
            <h2>Let&apos;s stay connected.</h2>
          </div>
        </div>

        <div className="contact-panel" data-entrance-item>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-link-panel contact-link-panel-simple"
          >
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
