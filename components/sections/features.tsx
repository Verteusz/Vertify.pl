"use client";

import { features } from "@/config/landing";
import { Icons } from "@/components/shared/icons";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section className="py-24 bg-gray-950">
      <MaxWidthWrapper>
        <div className="text-center mb-16">
          <HeaderSection
            label="Features"
            title="Everything you need to get online"
            subtitle="Build your business website in a few clicks. Custom templates, feature plugins, and AI content help you go live—fast!"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = Icons[feature.icon || "nextjs"]; // fallback
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#7c3aed]/50 transition-all duration-300 hover:bg-gray-900/80"
              >
                <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#7c3aed]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
