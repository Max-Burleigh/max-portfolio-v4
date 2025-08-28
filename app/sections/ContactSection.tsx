"use client";
import React, { forwardRef } from "react";
import { SiLinkedin } from "react-icons/si";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";

const ContactSection = forwardRef<HTMLDivElement>(function ContactSection(_, ref) {
  return (
    <section ref={ref} id="contact" className="section contact-section">
      <div className="glass-card contact-card">
        <h2>Contact</h2>
        <p>
          Feel free to reach out if you have a project in mind or just want to chat!
        </p>
        <div className="mt-4">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <div className="flex justify-center w-full mt-2">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors font-medium"
            >
              <SiLinkedin className="w-[22px] h-[22px] flex-shrink-0 mr-2" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
