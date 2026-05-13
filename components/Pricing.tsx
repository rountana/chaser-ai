"use client";

import { useState } from "react";
import StoreBadges from "./StoreBadges";

type Billing = "monthly" | "annual";

type Tier = {
  id: "free" | "monthly" | "annual" | "lifetime";
  name: string;
  tagline: string;
  features: string[];
  priceMonthly?: string;
  priceAnnual?: string;
  priceAnnualPer?: string;
  flatPrice?: string;
  priceSuffix?: string;
  cta?: string;
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "The fastest desktop search you've ever used. Forever.",
    flatPrice: "$0",
    priceSuffix: "free forever",
    features: [
      "Local semantic search",
      "Natural-language queries (basic model)",
      "Single device",
      "Index up to 100k files",
      "Community support",
    ],
  },
  {
    id: "monthly",
    name: "Pro · Monthly",
    tagline: "Unlimited AI search for power users.",
    priceMonthly: "$9",
    priceAnnual: "$9",
    priceSuffix: "per month",
    features: [
      "Everything in Free",
      "Unlimited AI queries, advanced models",
      "Content-aware indexing (PDF, OCR, code)",
      "Up to 3 devices",
      "Priority email support",
    ],
    cta: "Start free trial",
  },
  {
    id: "annual",
    name: "Pro · Annual",
    tagline: "Same Pro, billed yearly. Save ~33%.",
    priceMonthly: "$9",
    priceAnnual: "$6",
    priceAnnualPer: "$72 billed yearly",
    priceSuffix: "per month",
    features: [
      "Everything in Pro Monthly",
      "Save 33% vs. monthly",
      "Up to 5 devices",
      "Early access to new features",
      "Priority email support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    tagline: "Pay once. Own forever. Limited launch offer.",
    flatPrice: "$199",
    priceSuffix: "one-time",
    features: [
      "Everything in Pro Annual",
      "All future updates included",
      "Unlimited devices",
      "Founder badge in-app",
      "Lifetime priority support",
    ],
    cta: "Get lifetime access",
  },
];

function formatPrice(tier: Tier, billing: Billing) {
  if (tier.flatPrice) return { value: tier.flatPrice, suffix: tier.priceSuffix };
  if (billing === "monthly")
    return { value: tier.priceMonthly, suffix: tier.priceSuffix };
  return { value: tier.priceAnnual, suffix: tier.priceSuffix };
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <section id="pricing" className="py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
            Free to start. Pay only if you love it.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            14-day free trial on every paid plan. Cancel anytime — your local index stays yours.
          </p>
        </div>

        <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] p-1 text-sm">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              billing === "monthly"
                ? "bg-white/10 text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            aria-pressed={billing === "monthly"}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            className={`px-4 py-1.5 rounded-full transition-colors inline-flex items-center gap-2 ${
              billing === "annual"
                ? "bg-white/10 text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            aria-pressed={billing === "annual"}
          >
            Annual
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-glow)] rounded px-1.5 py-0.5">
              -33%
            </span>
          </button>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const { value, suffix } = formatPrice(tier, billing);
            const isHighlight = tier.highlight;
            return (
              <li
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                  isHighlight
                    ? "border-[var(--accent)] bg-[var(--surface-elev)] shadow-[0_0_60px_-20px_var(--accent-glow)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
              >
                {isHighlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.18em] bg-[var(--accent)] text-[#0a0a0a] rounded-full px-3 py-1">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {tier.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)] min-h-[2.5rem]">
                  {tier.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {value}
                  </span>
                  {suffix && (
                    <span className="text-xs text-[var(--muted)] ml-1">
                      / {suffix}
                    </span>
                  )}
                </div>
                {tier.priceAnnualPer && billing === "annual" && (
                  <p className="mt-1 text-[11px] font-mono text-[var(--muted)]">
                    {tier.priceAnnualPer}
                  </p>
                )}
                {tier.id === "lifetime" && (
                  <p className="mt-1 text-[11px] font-mono text-[var(--accent)]">
                    Limited launch offer
                  </p>
                )}

                <ul className="mt-5 space-y-2 text-sm text-[var(--muted)] flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--accent)] mt-0.5 shrink-0"
                        aria-hidden
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {tier.id === "free" ? (
                    <StoreBadges size="sm" />
                  ) : (
                    <>
                      <a
                        href="#download"
                        className={`block text-center text-sm font-medium rounded-full px-4 py-2.5 transition-colors ${
                          isHighlight
                            ? "bg-[var(--accent)] text-[#0a0a0a] hover:bg-[#bfa6ff]"
                            : "border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        }`}
                      >
                        {tier.cta}
                      </a>
                      <p className="mt-2 text-[10px] text-center font-mono text-[var(--muted)]">
                        Available on App Store &amp; Play Store
                      </p>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          All paid plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
