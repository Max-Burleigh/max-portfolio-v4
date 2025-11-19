"use client";
import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { useEntranceStagger } from "@lib/hooks";

const ServicesSection = forwardRef<HTMLDivElement>(function ServicesSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  
  // Stagger animations for the cards
  useEntranceStagger(entranceRef, { baseDelay: 100, step: 80 });

  const services = [
    {
      title: "Design & Development",
      price: "$3,000 - $5,000+",
      description: "A completely custom website built with modern tech (Next.js, React) — not a generic template.",
      features: [
        "Custom UI/UX Design",
        "SEO Optimization",
        "Mobile Responsive",
        "Fast Performance",
        "CMS Integration"
      ],
      gradient: "from-blue-400/20 to-blue-600/20"
    },
    {
      title: "Hosting & Care",
      price: "$75 / month",
      description: "I handle the technical headaches so you don't have to. Peace of mind for your business.",
      features: [
        "Secure Vercel Hosting",
        "Domain Management",
        "Security Updates",
        "Uptime Monitoring",
        "Monthly Health Report"
      ],
      gradient: "from-purple-400/20 to-purple-600/20"
    },
    {
      title: "Technical Setup",
      price: "Included",
      description: "Professional email and infrastructure setup to get your business running correctly.",
      features: [
        "Google Workspace Setup",
        "DNS Configuration",
        "Professional Email",
        "Analytics Setup",
        "Search Console"
      ],
      gradient: "from-pink-400/20 to-pink-600/20"
    }
  ];

  return (
    <section ref={ref} id="services" className="section services-section">
      <div 
        ref={entranceRef}
        data-entrance="services"
        className="w-full max-w-5xl mx-auto"
      >
        <h2 className="text-center mb-12" data-entrance-item>
          Services & Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              data-entrance-item
              className="glass-card w-full !m-0 !p-6 !max-w-full flex flex-col h-full"
              whileHover={{ 
                y: -5,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                transition: { duration: 0.2 }
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2 font-space-grotesk">{service.title}</h3>
                <div className="text-2xl font-bold text-[#00ffd5] mb-4">{service.price}</div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed min-h-[3rem]">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mt-auto">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-200">
                      <span className="mr-2 text-[#00ffd5]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center" data-entrance-item>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Need something different? I also offer hourly consulting for custom web applications and complex integrations.
          </p>
        </div>
      </div>
    </section>
  );
});

export default ServicesSection;
