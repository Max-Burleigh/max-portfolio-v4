"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MdAdd, MdArrowForward, MdCheckCircle, MdErrorOutline, MdMonitorWeight, MdRocketLaunch, MdSecurity, MdSpeed, MdWorkspaces } from "react-icons/md";
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

const supportCardTransition = {
  type: "spring",
  stiffness: 175,
  damping: 27,
  mass: 1.05,
} as const;

const supportCardVariants = {
  expanded: {
    scale: 1,
  },
  compact: {
    scale: 1,
  },
} as const;

const supportIconVariants = {
  expanded: {
    width: 46,
    height: 46,
    borderRadius: 15,
    fontSize: "1.55rem",
  },
  compact: {
    width: 46,
    height: 46,
    borderRadius: 15,
    fontSize: "1.55rem",
  },
} as const;

const supportHeadingVariants = {
  expanded: {
    fontSize: "clamp(1.35rem, 2vw, 1.9rem)",
  },
  compact: {
    fontSize: "clamp(1.35rem, 2vw, 1.9rem)",
  },
} as const;

const supportCopyVariants = {
  expanded: {
    fontSize: "0.9rem",
  },
  compact: {
    fontSize: "0.9rem",
  },
} as const;

const supportPriceVariants = {
  expanded: {
    fontSize: "clamp(2.1rem, 3vw, 3rem)",
  },
  compact: {
    fontSize: "clamp(2.1rem, 3vw, 3rem)",
  },
} as const;

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
  const supportMode = selectedPlan ? "compact" : "expanded";

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
      <motion.div
        layout="size"
        ref={entranceRef}
        transition={supportCardTransition}
        className={`services-cockpit ${selectedPlan ? "has-compact-support" : "has-expanded-support"} ${servicesEntered ? "is-entered" : ""}`}
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

        <motion.div
          layout="size"
          variants={supportCardVariants}
          initial={false}
          animate={supportMode}
          transition={supportCardTransition}
          className={`service-support-card ${selectedPlan ? "is-compact" : "is-expanded"} ${hasSubscription ? "is-selected" : ""}`}
          data-entrance-item
        >
          <motion.div layout="size" className="support-main" transition={supportCardTransition}>
            <motion.span
              layout="size"
              variants={supportIconVariants}
              transition={supportCardTransition}
              className="support-icon"
            >
              <MdSecurity aria-hidden="true" />
            </motion.span>
            <div>
              <p className="service-plan-kicker">Monthly subscription</p>
              <motion.h3 layout="size" variants={supportHeadingVariants} transition={supportCardTransition}>
                Peace of Mind
              </motion.h3>
              <motion.p layout="size" variants={supportCopyVariants} transition={supportCardTransition}>
                Managed hosting, domain care, uptime monitoring, Google Workspace help, and bug fixes.
              </motion.p>
            </div>
          </motion.div>
          <motion.div layout="size" className="support-price" transition={supportCardTransition}>
            <motion.strong layout="size" variants={supportPriceVariants} transition={supportCardTransition}>
              $150
            </motion.strong>
            <span>/ month</span>
          </motion.div>
          <motion.div layout="size" className="support-pills" aria-label="Support includes" transition={supportCardTransition}>
            <span><MdRocketLaunch /> Hosting</span>
            <span><MdWorkspaces /> Workspace</span>
            <span><MdMonitorWeight /> Monitoring</span>
            <span><MdSpeed /> Fixes</span>
          </motion.div>
          <motion.div layout="size" className="support-detail-band" aria-label="Managed support details" transition={supportCardTransition}>
            {supportDetails.map((item) => (
              <span key={item}><MdCheckCircle aria-hidden="true" /> {item}</span>
            ))}
          </motion.div>
          <button type="button" onClick={handleSubscriptionToggle} className={`support-toggle ${hasSubscription ? "is-selected" : ""}`}>
            {hasSubscription ? <><MdCheckCircle /> Added</> : <><MdAdd /> Add support</>}
          </button>
        </motion.div>
      </motion.div>

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
