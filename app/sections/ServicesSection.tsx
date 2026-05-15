"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MdArrowForward,
  MdCheckCircle,
  MdDashboardCustomize,
  MdDevices,
  MdErrorOutline,
  MdManageSearch,
  MdOutlineEmail,
  MdQueryStats,
  MdReceiptLong,
  MdSupportAgent,
  MdViewModule,
} from "react-icons/md";
import { useEntranceStagger } from "@lib/hooks";

const planKeys = ["ESSENTIAL", "GROWTH"] as const;
type PlanKey = (typeof planKeys)[number];

const desktopPlanHighlights = {
  ESSENTIAL: [
    { title: "Up to 5 pages", detail: "For smaller sites and local businesses", icon: MdDevices },
    { title: "Custom email + contact form", detail: "Look professional from day one", icon: MdOutlineEmail },
    { title: "SEO optimized", detail: "Easier to find on Google", icon: MdManageSearch },
  ],
  GROWTH: [
    { title: "10+ pages", detail: "For larger sites and brands", icon: MdViewModule },
    { title: "Easy site updates", detail: "Change content yourself", icon: MdDashboardCustomize },
    { title: "Analytics setup", detail: "See how visitors use your site", icon: MdQueryStats },
  ],
} as const;

const planTaglines = {
  ESSENTIAL: "A custom site with the essentials handled.",
  GROWTH: "A larger site with more control and insight.",
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

const ServicesSection = forwardRef<HTMLDivElement, object>((_, ref) => {
  const router = useRouter();
  const entranceRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  useEntranceStagger(entranceRef, { baseDelay: 80, step: 45 });

  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [previewPlan, setPreviewPlan] = useState<PlanKey>("ESSENTIAL");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shakePlans, setShakePlans] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [servicesEntered, setServicesEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const enterTimer = window.setTimeout(() => setServicesEntered(true), 40);
    const savedPlan = sessionStorage.getItem("selectedPlan");
    const savedSubscription = sessionStorage.getItem("hasSubscription");

    if (savedPlan === "ESSENTIAL" || savedPlan === "GROWTH") {
      setSelectedPlan(savedPlan);
      setPreviewPlan(savedPlan);
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
    setPreviewPlan(plan);

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
    const params = new URLSearchParams();

    if (selectedPlan) {
      params.set("plan", selectedPlan);
    }
    if (hasSubscription) {
      params.set("support", "true");
    }

    const query = params.toString();
    router.push(query ? `/get-started?${query}` : "/get-started");
  };

  const shortPlanLabel =
    selectedPlan === "ESSENTIAL"
      ? "Essential"
      : selectedPlan === "GROWTH"
        ? "Growth"
        : null;
  const planPrice = selectedPlan === "ESSENTIAL" ? "$3,000" : selectedPlan === "GROWTH" ? "$5,000" : null;
  const hasSelection = Boolean(selectedPlan || hasSubscription);
  const activeDesktopPlan = selectedPlan ?? previewPlan;
  const mobileDisplayPlan = selectedPlan ?? "GROWTH";
  const mobileDisplayPlanLabel = mobileDisplayPlan === "ESSENTIAL" ? "Essential" : "Growth";
  const mobileDisplayPrice = mobileDisplayPlan === "ESSENTIAL" ? "$3,000" : "$5,000";
  const mobilePlanThemeClass = mobileDisplayPlan === "GROWTH" ? "is-growth" : "is-essential";
  const isMobilePlanPreview = !selectedPlan;

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
            <h2 className="service-heading-desktop">Design-forward websites engineered to win customers.</h2>
            <h2 className="service-heading-mobile">Websites that win customers.</h2>
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
          <div className={`mobile-plan-tabs ${mobilePlanThemeClass}`} aria-label="Build package options">
            <span className="mobile-plan-tab-indicator" aria-hidden="true" />
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
                </button>
              );
            })}
          </div>

          <div key={mobileDisplayPlan} className="mobile-plan-content">
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
              {desktopPlanHighlights[mobileDisplayPlan].map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <li key={feature.title}>
                    <FeatureIcon aria-hidden="true" />
                    <span className="mobile-feature-chip-copy">
                      <span>{feature.title}</span>
                      <small>{feature.detail}</small>
                    </span>
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
          </div>

          <button
            type="button"
            onClick={handleSubscriptionToggle}
            aria-pressed={hasSubscription}
            aria-label={hasSubscription ? "Remove hosting and maintenance support" : "Add hosting and maintenance support"}
            className={`mobile-support-row ${hasSubscription ? "is-selected" : ""} ${!selectedPlan ? "is-unavailable" : ""}`}
          >
            <span>
              <strong>Hosting + Maintenance</strong>
              <small>$150 / month</small>
            </span>
            <span className="mobile-support-switch" aria-hidden="true">
              <span />
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
            className="service-plan-swiper"
            aria-label="Build package options"
          >
            {planKeys.map((plan) => {
              const isSelected = selectedPlan === plan;
              const isExpanded = activeDesktopPlan === plan;
              return (
                <motion.button
                  key={plan}
                  type="button"
                  onClick={() => handlePlanSelection(plan)}
                  aria-pressed={isSelected}
                  className={`service-plan-card ${plan === "ESSENTIAL" ? "is-essential" : "is-growth"} ${isSelected ? "is-selected" : "is-dimmed"} ${isExpanded ? "is-expanded" : ""} ${shakePlans ? "shake" : ""}`}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <div className="desktop-plan-shell">
                    <div className="desktop-plan-main">
                      <div className="desktop-plan-header">
                        <div className="desktop-plan-copy">
                          <span className="service-plan-title">{plan}</span>
                          <p className="service-plan-copy">{planTaglines[plan]}</p>
                        </div>
                        <div className="plan-card-price-row">
                          <span className="service-plan-price">{plan === "ESSENTIAL" ? "$3,000" : "$5,000"}</span>
                          <span className="plan-price-suffix">one-time</span>
                        </div>
                        <span className="desktop-plan-state" aria-hidden="true">
                          {isSelected ? <MdCheckCircle /> : "Select"}
                        </span>
                      </div>
                      <div className="desktop-plan-details" aria-hidden={!isExpanded}>
                        <div className="desktop-plan-details-inner">
                          <ul className="service-feature-rail" aria-label={`${plan.toLowerCase()} plan details`}>
                            {desktopPlanHighlights[plan].map((feature) => {
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
                            {isSelected ? <><MdCheckCircle /> Selected</> : <>Select {plan === "ESSENTIAL" ? "Essential" : "Growth"} <MdArrowForward aria-hidden="true" /></>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="service-lower-panels">
            <motion.button
              type="button"
              onClick={handleSubscriptionToggle}
              aria-pressed={hasSubscription}
              className={`service-support-card ${hasSubscription ? "is-selected" : ""} ${!selectedPlan ? "is-unavailable" : ""}`}
              whileTap={{ scale: 0.985 }}
            >
              <div className="desktop-plan-shell">
                <div className="desktop-plan-main">
                  <div className="desktop-plan-header">
                    <div className="desktop-plan-copy">
                      <span className="service-plan-title support-eyebrow">Hosting + Maintenance</span>
                      <p className="service-plan-copy">Website hosting, security patches, and small content changes/updates.</p>
                    </div>
                    <div className="plan-card-price-row">
                      <span className="service-plan-price">$150</span>
                      <span className="plan-price-suffix">/ month</span>
                    </div>
                    <span className={`support-toggle-switch ${hasSubscription ? "is-selected" : ""}`} aria-hidden="true">
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>

            <div className={`service-selection-card ${hasSelection ? "has-selection" : ""} ${hasSubscription ? "has-support" : ""} ${selectedPlan === "GROWTH" ? "is-growth" : selectedPlan === "ESSENTIAL" ? "is-essential" : ""}`}>
              <div className="selection-dock-content">
                <div className="selection-panel-heading">
                  <span className="selection-panel-icon" aria-hidden="true">
                    <MdReceiptLong />
                  </span>
                  <div>
                    <div className="selection-dock-eyebrow">Your Estimate</div>
                    <p>{selectedPlan ? "Ready when you are" : "Choose a package to begin"}</p>
                  </div>
                </div>

                <div className="selection-summary" aria-label="Selection summary">
                  <div className="selection-summary-row">
                    <span className="selection-summary-icon" aria-hidden="true"><MdViewModule /></span>
                    <span className="selection-summary-copy">
                      <span>Build</span>
                      <strong>{shortPlanLabel ?? "Not selected"}</strong>
                    </span>
                    <em>{planPrice ?? "--"}</em>
                  </div>
                  <div
                    className={`selection-summary-collapsible ${hasSubscription ? "is-open" : ""}`}
                    aria-hidden={!hasSubscription}
                  >
                    <div className="selection-summary-collapsible-inner">
                      <div className="selection-summary-row selection-summary-row-support">
                        <span className="selection-summary-icon" aria-hidden="true"><MdSupportAgent /></span>
                        <span className="selection-summary-copy">
                          <span>Support</span>
                          <strong>Added</strong>
                        </span>
                        <em>$150 / mo</em>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="selection-total">
                  <span>Total</span>
                  <strong>
                    {planPrice ?? "$0"}
                    <small>one-time</small>
                  </strong>
                  <p>{hasSubscription ? "+ $150 / month support" : "Support optional"}</p>
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
