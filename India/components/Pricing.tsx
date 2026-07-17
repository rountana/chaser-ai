"use client";

import { useState } from "react";
import StoreBadges from "./StoreBadges";

type Billing = "monthly" | "annual";

type Tier = {
  id: "free" | "byok" | "lifetime" | "managed";
  name: string;
  tagline: string;
  features: string[];
  priceMonthly?: string;
  priceAnnual?: string;
  priceAnnualPer?: string;
  flatPrice?: string;
  priceSuffix?: string;
  priceNote?: string;
  cta?: string;
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Bring your own key and search your first stack of documents free.",
    flatPrice: "$0",
    priceSuffix: "free forever",
    features: [
      "Bring your own API key",
      "Natural-language document search",
      "Index up to 2,000 pages",
      "Single device",
      "Community support",
    ],
  },
  {
    id: "byok",
    name: "Pro · BYOK",
    tagline: "Your key, your data. Unlimited indexing, all the power.",
    priceMonthly: "$6",
    priceAnnual: "$4",
    priceAnnualPer: "$48 billed yearly",
    priceSuffix: "per month",
    features: [
      "Everything in Free",
      "Unlimited pages indexed",
      "Any model — OpenAI, Anthropic, Gemini",
      "Up to 5 devices",
      "Priority support",
    ],
    cta: "Start with your key",
    highlight: true,
  },
  {
    id: "lifetime",
    name: "Lifetime · BYOK",
    tagline: "Pay once. Own forever. Your key covers the AI.",
    flatPrice: "$149",
    priceSuffix: "one-time",
    features: [
      "Everything in Pro",
      "All future updates included",
      "Unlimited devices",
      "Founder badge in-app",
      "Lifetime priority support",
    ],
    cta: "Get lifetime access",
  },
  {
    id: "managed",
    name: "Managed",
    tagline: "No key, no setup. We run the AI for you.",
    flatPrice: "$29",
    priceSuffix: "per month",
    priceNote: "1,500 pages/mo included · then $12 per 1,000",
    features: [
      "No API key needed",
      "1,500 pages indexed / month",
      "Fair-use AI search",
      "Encrypted in transit, never stored",
      "Priority email support",
    ],
    cta: "Start managed",
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
            Bring your own key. Or let us handle it.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            Plug in your own AI key and pay only for the app — your provider, your rates. Or go managed and we run everything for you, billed by what you index.
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
                {tier.priceNote && (
                  <p className="mt-1 text-[11px] font-mono text-[var(--accent)]">
                    {tier.priceNote}
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
          BYOK plans only pay for the app — your key covers the AI. Managed is billed monthly with metered indexing. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
