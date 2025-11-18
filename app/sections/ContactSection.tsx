"use client";
import React, { forwardRef, useRef } from "react";
import { SiLinkedin, SiMaildotru } from "react-icons/si";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { useEntranceStagger } from "@lib/hooks";

const ContactSection = forwardRef<HTMLDivElement>(function ContactSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 40, step: 90 });

  return (
    <section ref={ref} id="contact" className="section contact-section">
      <div ref={entranceRef} data-entrance="contact" className="glass-card contact-card">
        <h2 data-entrance-item>Contact</h2>
        <p className="text-left" data-entrance-item>
          Feel free to reach out if you have a project in mind or just want to chat!
        </p>
        <div className="mt-4 text-left space-y-2" data-entrance-item>
          <div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center"
            >
              <SiMaildotru className="w-[22px] h-[22px] flex-shrink-0 mr-2" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
          <div>
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
