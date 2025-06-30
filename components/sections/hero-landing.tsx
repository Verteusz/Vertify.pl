"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface HeroLandingProps {
  onGetStarted?: () => void;
}

export default function HeroLanding({ onGetStarted }: HeroLandingProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-black overflow-hidden py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-black to-black z-0" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c3aed' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="relative max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-[#7c3aed] rounded-full mr-2" />
            No-code websites for niche businesses
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Launch your custom
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]">
              business website<br className="hidden sm:inline" /> in minutes
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Build a professional online presence in just a few clicks. Select your industry, choose powerful plugins, let AI generate your content, and go live—no code required.
            <br className="hidden sm:block" />
            Perfect for agritourism, consultants, local businesses & any niche!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
              onClick={onGetStarted}
              className={cn(
                buttonVariants({ size: "lg", rounded: "lg" }),
                "bg-[#7c3aed] hover:bg-[#a78bfa] text-white flex items-center px-8 py-4 font-semibold group"
              )}
            >
              Get started for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg", rounded: "lg" }),
                "border-gray-700 text-white hover:border-gray-600 flex items-center px-8 py-4 font-semibold"
              )}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch 2-minute demo
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              { stat: "5,000+", label: "Websites launched" },
              { stat: "30+", label: "Industry templates" },
              { stat: "< 10 min", label: "to go live" },
              { stat: "AI", label: "Text generator" },
            ].map(({ stat, label }, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed] mb-1">{stat}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating blurred elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#7c3aed]/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#22d3ee]/20 rounded-full blur-3xl z-0" />
    </section>
  );
}
