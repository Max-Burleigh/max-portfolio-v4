"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MdAdd, MdArrowForward, MdCheckCircle, MdErrorOutline, MdSecurity } from "react-icons/md";
import { useEntranceStagger, useIsMobile } from "@lib/hooks";

interface ServicesSectionProps {
  onStartProject?: (data: { plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean }) => void;
}

type SelectionItem = {
  id: string;
  label: string;
  className?: string;
};

const planBullets = {
  ESSENTIAL: ["5-page custom site", "Email + contact setup", "SEO-ready launch"],
  GROWTH: ["10+ page site system", "Editable content dashboard", "Analytics + launch tracking"],
} as const;

const supportDetails = ["Hosting and DNS care", "Uptime monitoring", "Workspace help", "Small fixes and maintenance"];

const ServicesSection = forwardRef<HTMLDivElement, ServicesSectionProps>((_, ref) => {
  const router = useRouter();
  const entranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 80, step: 45 });

  const [selectedPlan, setSelectedPlan] = useState<"ESSENTIAL" | "GROWTH" | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shakePlans, setShakePlans] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [navigatedToContact, setNavigatedToContact] = useState(false);
  const [selectionTickerIndex, setSelectionTickerIndex] = useState(0);
  const [servicesEntered, setServicesEntered] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    const enterTimer = window.setTimeout(() => setServicesEntered(true), 40);
    const savedPlan = sessionStorage.getItem("selectedPlan");
    const savedSubscription = sessionStorage.getItem("hasSubscription");

    if (savedPlan === "ESSENTIAL" || savedPlan === "GROWTH") {
      setSelectedPlan(savedPlan);
    }
    if (savedSubscription === "true") {
      setHasSubscription(true);
    }

    return () => window.clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (!shakePlans) return;
    const timer = setTimeout(() => setShakePlans(false), 600);
    return () => clearTimeout(timer);
  }, [shakePlans]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast, toastKey]);

  const handlePlanSelection = (plan: "ESSENTIAL" | "GROWTH") => {
    setNavigatedToContact(false);
    if (selectedPlan === plan) {
      setSelectedPlan(null);
      setHasSubscription(false);
      sessionStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("hasSubscription");
      return;
    }

    setSelectedPlan(plan);
    sessionStorage.setItem("selectedPlan", plan);
  };

  const handleSubscriptionToggle = () => {
    if (!selectedPlan) {
      setShakePlans(true);
      setToastMessage("Select a build plan before adding managed support.");
      setToastKey((prev) => prev + 1);
      setShowToast(true);
      return;
    }

    const nextValue = !hasSubscription;
    setHasSubscription(nextValue);
    sessionStorage.setItem("hasSubscription", String(nextValue));
    setNavigatedToContact(false);
  };

  const handleContact = () => {
    setNavigatedToContact(true);
    const params = new URLSearchParams();
    if (selectedPlan) params.set("plan", selectedPlan);
    if (hasSubscription) params.set("support", "true");
    router.push(`/get-started?${params.toString()}`);
  };

  const planLabel =
    selectedPlan === "ESSENTIAL"
      ? "Essential Plan"
      : selectedPlan === "GROWTH"
        ? "Growth Plan"
        : null;

  const planClassName = selectedPlan === "GROWTH" ? "text-purple-300" : "text-teal-300";

  const selectionItems: SelectionItem[] = [];
  if (planLabel) selectionItems.push({ id: "plan", label: planLabel, className: planClassName });
  if (hasSubscription) selectionItems.push({ id: "subscription", label: "Peace of Mind", className: "text-white" });

  const shouldCycleSelections = isMobile && selectionItems.length > 1;
  const activeTickerItem = shouldCycleSelections && selectionItems.length > 0
    ? selectionItems[selectionTickerIndex % selectionItems.length]
    : null;

  useEffect(() => {
    if (!shouldCycleSelections || selectionItems.length === 0) {
      setSelectionTickerIndex(0);
      return;
    }

    const id = window.setInterval(() => {
      setSelectionTickerIndex((prev) => (prev + 1) % selectionItems.length);
    }, 3500);

    return () => window.clearInterval(id);
  }, [shouldCycleSelections, selectionItems.length]);

  return (
    <section ref={ref} id="services" className="section services-section">
      <div
        ref={entranceRef}
        className={`services-cockpit ${servicesEntered ? "is-entered" : ""}`}
        data-entrance="services-cockpit"
      >
        <div className="cockpit-header" data-entrance-item>
          <div>
            <p className="hero-eyebrow">Services</p>
            <h2>Build the site. Keep it fast.</h2>
          </div>
          <p>
            Two clear website builds, plus an optional managed support layer for hosting,
            domains, monitoring, and small fixes.
          </p>
        </div>

        <div className="service-plan-grid" data-entrance-item>
          {(["ESSENTIAL", "GROWTH"] as const).map((plan) => {
            const isSelected = selectedPlan === plan;
            return (
              <motion.button
                key={plan}
                type="button"
                onClick={() => handlePlanSelection(plan)}
                aria-pressed={isSelected}
                className={`service-plan-card ${plan === "ESSENTIAL" ? "is-essential" : "is-growth"} ${isSelected ? "is-selected" : ""} ${shakePlans ? "shake" : ""}`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="service-plan-title">{plan}</span>
                <span className="service-plan-price">{plan === "ESSENTIAL" ? "$3,000" : "$5,000"}</span>
                <span className="service-plan-copy">
                  {plan === "ESSENTIAL"
                    ? "A sharp, fast marketing site for a business that needs a professional web presence."
                    : "A larger site with editable content, analytics, and more room to grow."}
                </span>
                <span className="service-plan-bullets" role="list">
                  {planBullets[plan].map((feature) => (
                    <span key={feature} role="listitem">
                      <MdCheckCircle aria-hidden="true" />
                      {feature}
                    </span>
                  ))}
                </span>
                <span className="service-plan-action">
                  {isSelected ? <><MdCheckCircle /> Selected</> : "Select plan"}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div
          className={`service-support-card ${hasSubscription ? "is-selected" : ""}`}
          data-entrance-item
        >
          <div className="support-main">
            <span className="support-icon">
              <MdSecurity aria-hidden="true" />
            </span>
            <div>
              <p className="service-plan-kicker">Monthly subscription</p>
              <h3>Peace of Mind</h3>
              <p>
                Managed hosting, domain care, uptime monitoring, Google Workspace help, and bug fixes.
              </p>
            </div>
          </div>
          <div className="support-price">
            <strong>$150</strong>
            <span>/ month</span>
          </div>
          <div className="support-detail-band" aria-label="Managed support details">
            {supportDetails.map((item) => (
              <span key={item}><MdCheckCircle aria-hidden="true" /> {item}</span>
            ))}
          </div>
          <button type="button" onClick={handleSubscriptionToggle} className={`support-toggle ${hasSubscription ? "is-selected" : ""}`}>
            {hasSubscription ? <><MdCheckCircle /> Added</> : <><MdAdd /> Add support</>}
          </button>
        </div>
      </div>

      {mounted && createPortal(
        <>
          <AnimatePresence>
            {(selectedPlan || hasSubscription) && !navigatedToContact && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 inset-x-0 z-[9999] flex justify-center px-4 pointer-events-none"
              >
                <div className="pointer-events-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 pl-6 flex items-center gap-6 max-w-2xl w-full ring-1 ring-white/5">
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">
                      Your Selection
                    </div>
                    <div className="flex items-center gap-2 text-white font-space-grotesk truncate min-h-[1.5rem]">
                      {shouldCycleSelections ? (
                        <div className="relative h-6 flex items-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            {activeTickerItem && (
                              <motion.span
                                key={activeTickerItem.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className={`block truncate ${activeTickerItem.className ?? ""}`}
                              >
                                {activeTickerItem.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <>
                          {planLabel && <span className={planClassName}>{planLabel}</span>}
                          {selectedPlan && hasSubscription && <span className="text-white/30">+</span>}
                          {hasSubscription && <span>Peace of Mind</span>}
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleContact}
                    className="flex-shrink-0 bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Let&apos;s Start <MdArrowForward />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showToast && toastMessage && (
              <motion.div
                key={toastKey}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                role="status"
                aria-live="polite"
                className="fixed bottom-28 right-6 left-6 md:left-auto z-[9999] pointer-events-auto"
              >
                <div className="rounded-2xl bg-white/10 border border-white/15 shadow-2xl shadow-black/60 backdrop-blur-xl px-5 py-4 flex items-center gap-3 text-sm text-white font-semibold">
                  <MdErrorOutline size={20} className="text-teal-300" aria-hidden="true" />
                  <span className="leading-snug">{toastMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
