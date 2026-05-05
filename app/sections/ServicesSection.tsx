"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  MdAdd,
  MdArrowForward,
  MdBuild,
  MdCheckCircle,
  MdDashboardCustomize,
  MdDevices,
  MdErrorOutline,
  MdManageSearch,
  MdOutlineEmail,
  MdQueryStats,
  MdShield,
  MdSupportAgent,
  MdViewModule,
} from "react-icons/md";
import { useEntranceStagger, useIsMobile } from "@lib/hooks";

type SelectionItem = {
  id: string;
  label: string;
  className?: string;
};

const planKeys = ["ESSENTIAL", "GROWTH"] as const;
type PlanKey = (typeof planKeys)[number];

const planFeatures = {
  ESSENTIAL: [
    { title: "Custom 5-page site", detail: "Mobile-first, on-brand design", icon: MdDevices },
    { title: "Email + contact", detail: "Workspace setup and forms wired", icon: MdOutlineEmail },
    { title: "Launch-ready SEO", detail: "Schema, sitemap, OG tags shipped", icon: MdManageSearch },
  ],
  GROWTH: [
    { title: "10+ page system", detail: "Modular components, room to grow", icon: MdViewModule },
    { title: "Editable dashboard", detail: "Update copy and images yourself", icon: MdDashboardCustomize },
    { title: "Built-in analytics", detail: "GA4 events + conversion views", icon: MdQueryStats },
  ],
} as const;

const planTaglines = {
  ESSENTIAL: "A sharp marketing site, launch-ready.",
  GROWTH: "A larger system with analytics and room to grow.",
} as const;

const compactFeatureLabels = {
  ESSENTIAL: ["5-page site", "Email + forms", "SEO"],
  GROWTH: ["10+ pages", "Editable", "Analytics"],
} as const;

const compactDetailLabels = {
  ESSENTIAL: [
    "Fully custom design, no templates",
    "5 core pages",
    "Fast loading",
    "Google Workspace email setup",
    "Contact form + map integration",
  ],
  GROWTH: [
    "Everything in Essential",
    "10+ custom pages",
    "Easy-to-use content editor",
    "Analytics dashboard setup",
  ],
} as const;

const supportFeatures = [
  { title: "Website hosting", detail: "Site stays live and secure", icon: MdShield },
  { title: "Workspace help", detail: "Email, calendars, accounts", icon: MdSupportAgent },
  { title: "Small fixes", detail: "Copy, images, quick tweaks", icon: MdBuild },
] as const;

const ServicesSection = forwardRef<HTMLDivElement, object>((_, ref) => {
  const router = useRouter();
  const entranceRef = useRef<HTMLDivElement>(null);
  const planSwiperRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 80, step: 45 });

  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shakePlans, setShakePlans] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [selectionTickerIndex, setSelectionTickerIndex] = useState(0);
  const [activePlanSlide, setActivePlanSlide] = useState(0);
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

  const handlePlanSelection = (plan: PlanKey) => {
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

  const handlePlanSwiperScroll = () => {
    const swiper = planSwiperRef.current;
    if (!swiper) return;

    const slide = swiper.querySelector<HTMLElement>(".service-plan-card");
    if (!slide) return;

    const slideWidth = slide.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(swiper).columnGap || "0");
    const nextIndex = Math.round(swiper.scrollLeft / Math.max(1, slideWidth + gap));
    setActivePlanSlide(Math.max(0, Math.min(planKeys.length - 1, nextIndex)));
  };

  const handleSubscriptionToggle = () => {
    if (!selectedPlan) {
      setShakePlans(true);
      setToastMessage("Select a build plan before adding hosting + maintenance.");
      setToastKey((prev) => prev + 1);
      setShowToast(true);
      return;
    }

    const nextValue = !hasSubscription;
    setHasSubscription(nextValue);
    sessionStorage.setItem("hasSubscription", String(nextValue));
  };

  const handleContact = () => {
    router.push("/get-started");
  };

  const planLabel =
    selectedPlan === "ESSENTIAL"
      ? "Essential Plan"
      : selectedPlan === "GROWTH"
        ? "Growth Plan"
        : null;
  const planPrice = selectedPlan === "ESSENTIAL" ? "$3,000" : selectedPlan === "GROWTH" ? "$5,000" : null;
  const totalEstimate =
    selectedPlan === "ESSENTIAL"
      ? "$3,000"
      : selectedPlan === "GROWTH"
        ? "$5,000"
        : "Pending";

  const planClassName = selectedPlan === "GROWTH" ? "text-purple-300" : "text-teal-300";

  const selectionItems: SelectionItem[] = [];
  if (planLabel) selectionItems.push({ id: "plan", label: planLabel, className: planClassName });
  if (hasSubscription) selectionItems.push({ id: "subscription", label: "Hosting + Maintenance", className: "text-white" });
  const hasSelection = Boolean(selectedPlan || hasSubscription);
  const mobileDisplayPlan = selectedPlan ?? "GROWTH";
  const mobileDisplayPlanLabel = mobileDisplayPlan === "ESSENTIAL" ? "Essential" : "Growth";
  const mobileDisplayPrice = mobileDisplayPlan === "ESSENTIAL" ? "$3,000" : "$5,000";
  const mobilePlanThemeClass = mobileDisplayPlan === "GROWTH" ? "is-growth" : "is-essential";
  const isMobilePlanPreview = !selectedPlan;

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
            <p className="services-eyebrow">Web Development &amp; Design Services</p>
            <h2>Design-forward websites engineered to win customers.</h2>
          </div>
          <p className="service-copy-desktop">
            Choose from two web development and design packages: Essentials and Growth—plus
            an optional $150/month support plan for ongoing maintenance and operations.
          </p>
          <p className="service-copy-mobile">
            Choose from two website packages, then add support if needed.
          </p>
        </div>

        <div className={`mobile-service-configurator ${mobilePlanThemeClass} ${selectedPlan ? "has-selection" : "is-previewing"}`} data-entrance-item>
          <div className="mobile-plan-tabs" aria-label="Build package options">
            {planKeys.map((plan) => {
              const isActive = selectedPlan === plan;
              const isPreview = isMobilePlanPreview && mobileDisplayPlan === plan;
              return (
                <button
                  key={plan}
                  type="button"
                  aria-pressed={selectedPlan === plan}
                  className={`mobile-plan-tab ${isActive ? "is-active" : ""} ${isPreview ? "is-preview" : ""} ${plan === "GROWTH" ? "is-growth" : "is-essential"}`}
                  onClick={() => {
                    if (selectedPlan !== plan) handlePlanSelection(plan);
                  }}
                >
                  <span>{plan === "ESSENTIAL" ? "Essential" : "Growth"}</span>
                  <strong>{plan === "ESSENTIAL" ? "$3,000" : "$5,000"}</strong>
                </button>
              );
            })}
          </div>

          <div className="mobile-plan-summary">
            <div>
              <span className="mobile-plan-kicker">{mobileDisplayPlan}</span>
              <p>{planTaglines[mobileDisplayPlan]}</p>
            </div>
            <div className="mobile-plan-price">
              <strong>{mobileDisplayPrice}</strong>
              <span>one-time</span>
            </div>
          </div>

          <ul className="mobile-feature-chips" aria-label={`${mobileDisplayPlan.toLowerCase()} plan highlights`}>
            {planFeatures[mobileDisplayPlan].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <li key={feature.title}>
                  <FeatureIcon aria-hidden="true" />
                  <span>{compactFeatureLabels[mobileDisplayPlan][index]}</span>
                </li>
              );
            })}
          </ul>

          <div className="mobile-plan-details" aria-label={`${mobileDisplayPlan.toLowerCase()} plan details`}>
            <ul>
              {compactDetailLabels[mobileDisplayPlan].map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleSubscriptionToggle}
            aria-pressed={hasSubscription}
            className={`mobile-support-row ${hasSubscription ? "is-selected" : ""} ${!selectedPlan ? "is-unavailable" : ""}`}
          >
            <span>
              <strong>Hosting + Maintenance</strong>
              <small>$150 / month</small>
            </span>
            <span className="mobile-support-pill">
              {hasSubscription ? <MdCheckCircle aria-hidden="true" /> : <MdAdd aria-hidden="true" />}
              {hasSubscription ? "Added" : "Add support"}
            </span>
          </button>

          <button
            type="button"
            onClick={selectedPlan ? handleContact : () => handlePlanSelection(mobileDisplayPlan)}
            className="mobile-start-button"
          >
            {selectedPlan ? "Let's Start" : `Select ${mobileDisplayPlanLabel}`} <MdArrowForward aria-hidden="true" />
          </button>
        </div>

        <div className={`service-plan-grid ${selectedPlan ? "has-card-focus" : ""}`} data-entrance-item>
          <div
            ref={planSwiperRef}
            className="service-plan-swiper"
            aria-label="Build package options"
            onScroll={handlePlanSwiperScroll}
          >
            {planKeys.map((plan) => {
              const isSelected = selectedPlan === plan;
              return (
                <motion.button
                  key={plan}
                  type="button"
                  onClick={() => handlePlanSelection(plan)}
                  aria-pressed={isSelected}
                  className={`service-plan-card ${plan === "ESSENTIAL" ? "is-essential" : "is-growth"} ${isSelected ? "is-selected" : "is-dimmed"} ${shakePlans ? "shake" : ""}`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="plan-card-header">
                    <span className="service-plan-title">{plan}</span>
                    <div className="plan-card-price-row">
                      <span className="service-plan-price">{plan === "ESSENTIAL" ? "$3,000" : "$5,000"}</span>
                      <span className="plan-price-suffix">one-time</span>
                    </div>
                  </div>
                  <p className="service-plan-copy">{planTaglines[plan]}</p>
                  <ul className="service-feature-rail" aria-label={`${plan.toLowerCase()} plan details`}>
                    {planFeatures[plan].map((feature) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <li key={feature.title} className="service-feature-column">
                          <span className="service-feature-icon" aria-hidden="true">
                            <FeatureIcon />
                          </span>
                          <span className="service-feature-text">
                            <span className="service-feature-title">{feature.title}</span>
                            <span className="service-feature-detail">{feature.detail}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <span className="service-plan-action">
                    {isSelected ? <><MdCheckCircle /> Selected</> : "Select plan"}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="service-plan-pagination" aria-hidden="true">
            <span>Swipe plans</span>
            <div>
              {planKeys.map((plan, index) => (
                <i key={plan} className={activePlanSlide === index ? "is-active" : ""} />
              ))}
            </div>
          </div>

          <div className="service-lower-panels">
            <motion.button
              type="button"
              onClick={handleSubscriptionToggle}
              aria-pressed={hasSubscription}
              className={`service-support-card ${hasSubscription ? "is-selected" : ""} ${!selectedPlan ? "is-unavailable" : ""}`}
              whileTap={{ scale: 0.985 }}
            >
              <div className="plan-card-header">
                <span className="service-plan-title support-eyebrow">Hosting + Maintenance</span>
                <div className="plan-card-price-row">
                  <span className="service-plan-price">$150</span>
                  <span className="plan-price-suffix">/ month</span>
                </div>
              </div>
              <p className="service-plan-copy">
                Monthly maintenance, hosting, and support.
              </p>
              <ul className="service-feature-rail support-feature-rail" aria-label="Managed support details">
                {supportFeatures.map((feature) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <li key={feature.title} className="service-feature-column support-feature-column">
                      <span className="service-feature-icon support-feature-icon" aria-hidden="true">
                        <FeatureIcon />
                      </span>
                      <span className="service-feature-text support-feature-text">
                        <span className="service-feature-title support-feature-title">{feature.title}</span>
                        <span className="service-feature-detail support-feature-detail">{feature.detail}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <span className={`service-plan-action support-toggle ${hasSubscription ? "is-selected" : ""}`}>
                {hasSubscription ? <><MdCheckCircle /> Added</> : <><MdAdd /> Add support</>}
              </span>
            </motion.button>

            <div className={`service-selection-card ${hasSelection ? "has-selection" : ""} ${hasSubscription ? "has-support" : ""} ${selectedPlan === "GROWTH" ? "is-growth" : selectedPlan === "ESSENTIAL" ? "is-essential" : ""}`}>
              <div className="selection-dock-content">
                <div className="selection-dock-copy">
                  <div className="selection-dock-eyebrow">
                    Your Selection
                  </div>
                  <div className={`selection-dock-label ${hasSelection ? "" : "is-empty"}`}>
                    {!hasSelection ? (
                      <span>Choose a plan to start.</span>
                    ) : shouldCycleSelections ? (
                      <div className="selection-ticker">
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
                        {selectedPlan && hasSubscription && <span className="selection-dock-plus">+</span>}
                        {hasSubscription && <span>Hosting + Maintenance</span>}
                      </>
                    )}
                  </div>
                  <div className="selection-summary" aria-label="Selection summary">
                    <div>
                      <span>Build</span>
                      <strong>{planLabel ?? "Not selected"}</strong>
                    </div>
                    <div>
                      <span>Project fee</span>
                      <strong>{planPrice ?? "--"}</strong>
                    </div>
                    <div>
                      <span>Support</span>
                      <strong>{hasSubscription ? "$150 / month" : "Optional"}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{totalEstimate}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContact}
                  disabled={!hasSelection}
                  className="selection-dock-button"
                >
                  Let&apos;s Start <MdArrowForward aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <>
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
                className="service-toast"
              >
                <div className="service-toast-panel">
                  <MdErrorOutline aria-hidden="true" />
                  <span>{toastMessage}</span>
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
