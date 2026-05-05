"use client";

import React, { useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdCloudUpload, MdClose, MdArrowBack, MdSend, MdCheck, MdShuffle } from "react-icons/md";
import Link from "next/link";
import AuroraBackground from "@components/AuroraBackground";

// Color palette presets - curated collection
const COLOR_PALETTES = [
  // Blues & Teals
  { id: "ocean", name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#14b8a6", "#1e293b"] },
  { id: "arctic", name: "Arctic", colors: ["#38bdf8", "#7dd3fc", "#e0f2fe", "#0c4a6e"] },
  { id: "midnight", name: "Midnight", colors: ["#1e3a5f", "#3b82f6", "#93c5fd", "#0f172a"] },

  // Warm tones
  { id: "sunset", name: "Sunset", colors: ["#f97316", "#ef4444", "#ec4899", "#1f2937"] },
  { id: "autumn", name: "Autumn", colors: ["#dc2626", "#ea580c", "#d97706", "#292524"] },
  { id: "terracotta", name: "Terracotta", colors: ["#c2410c", "#fb923c", "#fef3c7", "#431407"] },
  { id: "coral", name: "Coral", colors: ["#fb7185", "#f472b6", "#fbbf24", "#18181b"] },

  // Greens
  { id: "forest", name: "Forest", colors: ["#22c55e", "#16a34a", "#84cc16", "#1a2e1a"] },
  { id: "mint", name: "Mint", colors: ["#34d399", "#6ee7b7", "#d1fae5", "#064e3b"] },
  { id: "sage", name: "Sage", colors: ["#84cc16", "#a3e635", "#ecfccb", "#365314"] },
  { id: "emerald", name: "Emerald", colors: ["#059669", "#10b981", "#6ee7b7", "#022c22"] },

  // Purples
  { id: "royal", name: "Royal", colors: ["#8b5cf6", "#6366f1", "#a855f7", "#1e1b4b"] },
  { id: "lavender", name: "Lavender", colors: ["#a78bfa", "#c4b5fd", "#ede9fe", "#2e1065"] },
  { id: "grape", name: "Grape", colors: ["#7c3aed", "#8b5cf6", "#c4b5fd", "#1e1b4b"] },
  { id: "amethyst", name: "Amethyst", colors: ["#9333ea", "#a855f7", "#e9d5ff", "#3b0764"] },

  // Pinks & Magentas
  { id: "rose", name: "Rose", colors: ["#f43f5e", "#fb7185", "#fecdd3", "#4c0519"] },
  { id: "blush", name: "Blush", colors: ["#ec4899", "#f472b6", "#fce7f3", "#500724"] },
  { id: "fuchsia", name: "Fuchsia", colors: ["#c026d3", "#e879f9", "#fae8ff", "#4a044e"] },

  // Neutrals & Monochrome
  { id: "mono", name: "Monochrome", colors: ["#f8fafc", "#64748b", "#334155", "#0f172a"] },
  { id: "slate", name: "Slate", colors: ["#475569", "#94a3b8", "#e2e8f0", "#0f172a"] },
  { id: "warm-gray", name: "Warm Gray", colors: ["#78716c", "#a8a29e", "#f5f5f4", "#1c1917"] },
  { id: "noir", name: "Noir", colors: ["#18181b", "#3f3f46", "#a1a1aa", "#fafafa"] },

  // Vibrant & Bold
  { id: "neon", name: "Neon", colors: ["#22d3ee", "#a855f7", "#f472b6", "#0f0f0f"] },
  { id: "electric", name: "Electric", colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#111827"] },
  { id: "pop", name: "Pop Art", colors: ["#facc15", "#ef4444", "#3b82f6", "#fafafa"] },
  { id: "candy", name: "Candy", colors: ["#f472b6", "#fb923c", "#facc15", "#fef3c7"] },

  // Earth & Natural
  { id: "earth", name: "Earth", colors: ["#92400e", "#b45309", "#fbbf24", "#fef3c7"] },
  { id: "clay", name: "Clay", colors: ["#78350f", "#a16207", "#d97706", "#fffbeb"] },
  { id: "sand", name: "Sand", colors: ["#d6d3d1", "#a8a29e", "#78716c", "#292524"] },
  { id: "coffee", name: "Coffee", colors: ["#78350f", "#92400e", "#fef3c7", "#1c1917"] },
];

const GOAL_OPTIONS = [
  { value: "contact", label: "Get people to contact me" },
  { value: "book", label: "Book appointments/calls" },
  { value: "buy", label: "Sell products or services" },
  { value: "learn", label: "Learn about my business" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1-2months", label: "1-2 months" },
  { value: "3+months", label: "3+ months" },
  { value: "exploring", label: "Just exploring" },
];

interface FileWithPreview extends File {
  preview?: string;
}

function GetStartedForm() {
  const searchParams = useSearchParams();

  // Get plan info from URL
  const plan = searchParams.get("plan") as "ESSENTIAL" | "GROWTH" | null;
  const support = searchParams.get("support") === "true";

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    websiteUrl: "",
    businessDescription: "",
    mainGoal: "",
    timeline: "",
    colorPalette: "",
    customColors: [] as string[],
    inspirationUrl: "",
    name: "",
    email: "",
  });

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shuffle palettes - show 6 random ones
  const getRandomPalettes = useCallback(() => {
    const shuffled = [...COLOR_PALETTES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  const [displayedPalettes, setDisplayedPalettes] = useState(() => getRandomPalettes());

  const shufflePalettes = () => {
    setDisplayedPalettes(getRandomPalettes());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaletteSelect = (paletteId: string) => {
    const palette = COLOR_PALETTES.find(p => p.id === paletteId);
    setFormData(prev => ({
      ...prev,
      colorPalette: paletteId,
      customColors: palette ? [...palette.colors] : [], // Copy palette colors for customization
    }));
  };

  const handleCustomColorChange = (index: number, color: string) => {
    setFormData(prev => {
      const newColors = [...prev.customColors];
      newColors[index] = color;
      return {
        ...prev,
        customColors: newColors,
        // Mark as customized if color differs from original palette
        colorPalette: prev.colorPalette ? `${prev.colorPalette}-customized` : "",
      };
    });
  };

  const addCustomColor = () => {
    if (formData.customColors.length < 6) {
      setFormData(prev => ({
        ...prev,
        customColors: [...prev.customColors, "#6366f1"],
        colorPalette: prev.colorPalette ? `${prev.colorPalette}-customized` : "",
      }));
    }
  };

  const removeCustomColor = (index: number) => {
    if (formData.customColors.length > 1) {
      setFormData(prev => ({
        ...prev,
        customColors: prev.customColors.filter((_, i) => i !== index),
        colorPalette: prev.colorPalette ? `${prev.colorPalette}-customized` : "",
      }));
    }
  };

  const initializeCustomColors = () => {
    if (formData.customColors.length === 0) {
      setFormData(prev => ({
        ...prev,
        customColors: ["#0ea5e9", "#06b6d4", "#14b8a6"],
        colorPalette: "",
      }));
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 5 - files.length);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type.startsWith("image/") || file.type === "application/pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  }, [files.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).slice(0, 5 - files.length);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith("image/") || file.type === "application/pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.name || !formData.email) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitState("error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setSubmitState("error");
      return;
    }

    setSubmitState("sending");
    setErrorMessage("");

    try {
      // Convert files to base64
      const fileAttachments = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          return {
            filename: file.name,
            content: base64,
            type: file.type,
          };
        })
      );

      const response = await fetch("/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          plan,
          support,
          attachments: fileAttachments,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }

      // Clear the plan selection from sessionStorage after successful submission
      sessionStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("hasSubscription");

      setSubmitState("sent");
    } catch (err) {
      setSubmitState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  const planLabel = plan === "ESSENTIAL" ? "Essential" : plan === "GROWTH" ? "Growth" : null;

  if (submitState === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-6"
      >
        <div className="bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 rounded-2xl max-w-lg w-full text-center py-16 px-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <MdCheckCircle className="text-teal-400 text-5xl" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-4 font-space-grotesk text-white">You&apos;re all set!</h1>
          <p className="text-white/90 mb-8">
            Thanks for reaching out, {formData.name.split(" ")[0]}! I&apos;ll review your project brief and get back to you within 24 hours.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <MdArrowBack /> Back to homepage
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-white hover:text-teal-300 transition-colors mb-6 text-sm font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            <MdArrowBack /> Back to services
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-space-grotesk text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Let&apos;s get the basics
          </h1>
          <p className="text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            Takes about 60 seconds. I&apos;ll follow up within 24 hours.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Your Selection - Pre-filled */}
          {(plan || support) && (
            <div className="w-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Your Selection</p>
              <div className="flex flex-wrap gap-3">
                {planLabel && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    plan === "GROWTH"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  }`}>
                    {planLabel} Plan
                  </span>
                )}
                {support && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                    Peace of Mind Support
                  </span>
                )}
              </div>
            </div>
          )}

          {/* About Your Project */}
          <div className="w-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
            <p className="text-xs font-bold text-white/70 uppercase tracking-wider">About Your Project</p>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-white mb-2">
                Business name <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="Acme Inc."
                required
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-white mb-2">
                Current website URL <span className="text-white/60">(if you have one)</span>
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-white mb-2">
                What does your business do? <span className="text-white/60">(1-2 sentences)</span>
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                rows={2}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
                placeholder="We sell handmade candles to customers across the US..."
              />
            </div>

            <div>
              <label htmlFor="mainGoal" className="block text-sm font-medium text-white mb-2">
                Main goal for visitors
              </label>
              <select
                id="mainGoal"
                name="mainGoal"
                value={formData.mainGoal}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#1a1a2e]">Select an option...</option>
                {GOAL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Preferences */}
          <div className="w-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
            <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Quick Preferences</p>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-white mb-2">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#1a1a2e]">Select timeline...</option>
                {TIMELINE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Color Palette Picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-white">
                  Color preferences <span className="text-white/60">(pick a palette or customize)</span>
                </label>
                <button
                  type="button"
                  onClick={shufflePalettes}
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <MdShuffle className="text-sm" /> Shuffle
                </button>
              </div>

              {/* Preset Palettes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {displayedPalettes.map(palette => (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => handlePaletteSelect(palette.id)}
                    className={`group relative p-4 rounded-xl border transition-all ${
                      formData.colorPalette === palette.id
                        ? "border-teal-500 bg-teal-500/10 ring-1 ring-teal-500/30"
                        : "border-white/15 bg-black/30 hover:border-white/30 hover:bg-black/40"
                    }`}
                  >
                    {/* Checkmark for selected */}
                    {formData.colorPalette === palette.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"
                      >
                        <MdCheck className="text-black text-xs" />
                      </motion.div>
                    )}

                    {/* Color swatches */}
                    <div className="flex gap-1.5 mb-2">
                      {palette.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full ring-1 ring-white/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-white/90">{palette.name}</p>
                  </button>
                ))}
              </div>

              {/* Selected Colors - Editable */}
              {formData.customColors.length > 0 && (
                <div className="p-4 rounded-xl border border-teal-500/50 bg-teal-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">
                      Your colors <span className="text-white/50 font-normal">(click to edit)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, customColors: [], colorPalette: "" }))}
                      className="text-xs text-white/50 hover:text-white/80 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {formData.customColors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center gap-1.5 group/color">
                        <div className="relative">
                          <label className="relative cursor-pointer group">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleCustomColorChange(index, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div
                              className="w-10 h-10 rounded-xl ring-2 ring-white/20 shadow-lg transition-transform group-hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          </label>
                          {/* Remove button - always visible on mobile, hover on desktop */}
                          {formData.customColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCustomColor(index)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-xs opacity-100 md:opacity-0 md:group-hover/color:opacity-100 transition-opacity shadow-md"
                            >
                              <MdClose className="text-[10px]" />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-white/50 uppercase font-mono">{color}</span>
                      </div>
                    ))}
                    {formData.customColors.length < 6 && (
                      <button
                        type="button"
                        onClick={addCustomColor}
                        className="w-10 h-10 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center text-white/50 hover:border-teal-400 hover:text-teal-400 transition-colors self-start"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Start from scratch option */}
              {formData.customColors.length === 0 && (
                <button
                  type="button"
                  onClick={initializeCustomColors}
                  className="w-full p-4 rounded-xl border border-white/15 bg-black/30 hover:border-white/30 hover:bg-black/40 transition-all text-left"
                >
                  <span className="text-sm font-medium text-white">Start from scratch</span>
                  <p className="text-xs text-white/50 mt-1">Pick your own custom colors</p>
                </button>
              )}
            </div>

            <div>
              <label htmlFor="inspirationUrl" className="block text-sm font-medium text-white mb-2">
                Site you like <span className="text-white/60">(optional)</span>
              </label>
              <input
                type="url"
                id="inspirationUrl"
                name="inspirationUrl"
                value={formData.inspirationUrl}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* File Upload & Contact */}
          <div className="w-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
            <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Uploads & Contact</p>

            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Drop any files here <span className="text-white/60">(logo, photos, inspo - max 5 files)</span>
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-teal-500 bg-teal-500/10"
                    : "border-white/20 hover:border-white/40 bg-black/30"
                }`}
              >
                <MdCloudUpload className="text-4xl text-white/50 mx-auto mb-2" />
                <p className="text-sm text-white/80">
                  {isDragging ? "Drop files here..." : "Click or drag files here"}
                </p>
                <p className="text-xs text-white/50 mt-1">PNG, JPG, PDF up to 10MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* File List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {files.map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-white/80 truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-white/50 hover:text-red-400 transition-colors ml-2"
                        >
                          <MdClose />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Your name <span className="text-teal-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email <span className="text-teal-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {submitState === "error" && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitState === "sending"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-teal-500 text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(20,184,166,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {submitState === "sending" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                Send My Brief <MdSend />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <>
      <AuroraBackground />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        </div>
      }>
        <GetStartedForm />
      </Suspense>
    </>
  );
}
