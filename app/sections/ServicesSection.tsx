"use client";

import React, { forwardRef, useRef, useState } from "react";
import { useEntranceStagger } from "@lib/hooks";
import {
  MdSpeed,
  MdEditDocument,
  MdExpandMore,
  MdShield,
  MdRocketLaunch,
  MdLanguage,
  MdAdminPanelSettings,
  MdMonitorWeight,
  MdBugReport,
  MdSyncAlt,
  MdSecurity,
  MdWorkspaces,
  MdCheck,
} from "react-icons/md";

const ServicesSection = forwardRef<HTMLDivElement>((props, ref) => {
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 100, step: 50 });

  return (
    <section
      ref={ref}
      id="services"
      className="section services-section min-h-screen flex flex-col justify-center py-32 md:py-40"
    >
      <div
        ref={entranceRef}
        className="w-full max-w-5xl mx-auto"
        data-entrance="stagger"
      >
        <div className="portfolio-header mb-12">
          <h2 className="mb-0" data-entrance-item>
            Services
          </h2>
          <p className="portfolio-subcopy" data-entrance-item>
            Comprehensive web development solutions tailored to your business needs.
          </p>
        </div>

        <div className="mt-10 pt-10 border-t border-white/10 space-y-14">
          <div data-entrance-item>
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-white/70 font-space-grotesk font-semibold">
              Web Design & Development
            </p>
            <p className="text-lg text-white/80 mt-3 max-w-2xl">
              I break Web Design & Development into two tracks so it’s clear what we’re working on together.
            </p>
          </div>

        {/* 1. The Build Phase */}
        <div className="mb-20" data-entrance-item>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-white/40 mb-3 font-space-grotesk">
            ONE TIME PURCHASE
          </p>
          <h3 className="text-2xl font-bold mb-8 text-white/90 flex items-center gap-3 font-space-grotesk">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-manrope">1</span>
            The Build Phase
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Essential Plan */}
            <div className="glass-card !m-0 !w-full !max-w-none flex flex-col h-full relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-teal-300 mb-2 font-space-grotesk">ESSENTIAL</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white font-space-grotesk">$3,000</span>
                  </div>
                  <p className="text-white/60 mt-2 text-sm">Perfect for establishing a professional digital presence.</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "Fully Custom Design (No Templates)",
                    "5 Core Pages (Home, About, Services, etc.)",
                    "Ultra-Fast Loading Speeds",
                    "Professional Email Setup (Google Workspace)",
                    "Contact Form & Map Integration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <MdCheck size={18} className="text-teal-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))
                  }
                </ul>

                <button className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-auto">
                  Select Plan
                </button>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="glass-card !m-0 !w-full !max-w-none flex flex-col h-full relative group overflow-hidden border-teal-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-purple-300 mb-2 font-space-grotesk">GROWTH</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white font-space-grotesk">$5,000</span>
                  </div>
                  <p className="text-white/60 mt-2 text-sm">Best for businesses that need to update content frequently.</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3 text-sm text-white font-medium bg-white/5 p-2 rounded-lg -mx-2">
                    <MdCheck size={18} className="text-purple-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    Everything in Essential
                  </li>
                  {[
                    "10+ Custom Pages",
                    "Easy-to-Use Content Editor",
                    "Advanced SEO Setup",
                    "Analytics Dashboard Setup"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <MdCheck size={18} className="text-purple-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))
                  }
                </ul>

                <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 text-white font-bold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-auto">
                  Select Plan
                </button>
              </div>
            </div>
          </div>

          {/* Key Differentiator */}
          {/* Key Differentiator */}
          <div className="mt-12 grid md:grid-cols-2 gap-6" data-entrance-item>
            {/* Essential Differentiator */}
            <div className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <MdSpeed size={24} />
                </div>
                <h5 className="text-lg font-bold text-teal-300 font-space-grotesk">Essential</h5>
              </div>
              <p className="text-white/80 leading-relaxed">
                "I build it, I set up your email, and it sits there looking pretty and loading fast."
              </p>
            </div>

            {/* Growth Differentiator */}
            <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <MdEditDocument size={24} />
                </div>
                <h5 className="text-lg font-bold text-purple-300 font-space-grotesk">Growth</h5>
              </div>
              <p className="text-white/80 leading-relaxed">
                "I build it, I set up your email, and <strong className="text-white">YOU</strong> can log in to a dashboard to write blog posts or change your prices without emailing me."
              </p>
            </div>
          </div>
        </div>

        {/* 2. The "Peace of Mind" Plan */}
        <div data-entrance-item>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-white/40 mb-3 font-space-grotesk">
            MONTHLY SUBSCRIPTION
          </p>
          <h3 className="text-2xl font-bold mb-8 text-white/90 flex items-center gap-3 font-space-grotesk">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-manrope">2</span>
            The "Peace of Mind" Plan
          </h3>

          <div className="glass-card !m-0 !w-full !max-w-none relative overflow-hidden !p-0">

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-space-grotesk">
                    <MdSecurity size={28} className="text-teal-300" aria-hidden="true" />
                    Managed Hosting & Support
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white font-space-grotesk">$150 <span className="text-lg text-white/40 font-normal font-manrope">/ month</span></div>
                  <div className="text-xs text-teal-400 mt-1">Cancel anytime. You own your assets.</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Infrastructure */}
                <div>
                  <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 font-space-grotesk">Infrastructure</h5>
                  <ul className="space-y-3">
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdRocketLaunch size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Enterprise Hosting
                      </strong>
                      Vercel Edge Network (Global CDN).
                    </li>
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdLanguage size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Domain Management
                      </strong>
                      Annual <code className="bg-white/10 px-1 py-0.5 rounded text-xs">.com</code> renewals included.
                    </li>
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdShield size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Security
                      </strong>
                      SSL Encryption & DDoS protection.
                    </li>
                  </ul>
                </div>

                {/* Business Suite */}
                <div>
                  <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 font-space-grotesk">Business Suite</h5>
                  <ul className="space-y-3">
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdWorkspaces size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        3 Google Workspace Seats
                      </strong>
                      Included (value of ~$25/mo).
                    </li>
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdAdminPanelSettings size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Admin Management
                      </strong>
                      I handle user setup, password resets, and DNS records.
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 font-space-grotesk">Support</h5>
                  <ul className="space-y-3">
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdMonitorWeight size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Uptime Monitoring
                      </strong>
                      24/7 automated checks.
                    </li>
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdBugReport size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Bug Fixes
                      </strong>
                      Lifetime warranty on my code.
                    </li>
                    <li className="text-sm text-white/80">
                      <strong className="text-white block mb-0.5 flex items-center gap-2">
                        <MdSyncAlt size={18} className="text-teal-300 flex-shrink-0" aria-hidden="true" />
                        Asset Transfer
                      </strong>
                      If you leave, you get the code, domain, and email accounts.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24" data-entrance-item>
          <h3 className="text-2xl font-bold mb-8 text-white/90 font-space-grotesk text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem
              question="Do I own the code?"
              answer="Yes! Once the project is paid for, you own 100% of the code and assets. If you ever want to move to another developer, I'll package everything up for you."
            />
            <FAQItem
              question="Why is there a monthly fee?"
              answer="Websites need hosting, security updates, and domain renewals. My monthly plan covers all of this plus 24/7 monitoring and small content updates, so you never have to worry about your site going down."
            />
            <FAQItem
              question="Can I edit the content myself?"
              answer="On the Growth plan, yes! You get a simple dashboard to edit text and images. On the Essential plan, I handle updates for you to keep things simple and fast."
            />
            <FAQItem
              question="What technology do you use?"
              answer="I use modern, enterprise-grade tools that big tech companies use. This ensures your site is incredibly fast, secure, and ranks well on Google."
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all hover:bg-white/10"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-6 flex justify-between items-center gap-4">
        <h4 className="font-bold text-white/90 font-space-grotesk">{question}</h4>
        <MdExpandMore
          className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={24}
        />
      </div>
      <div
        className={`px-6 text-white/60 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        {answer}
      </div>
    </div>
  );
}
