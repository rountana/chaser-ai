import Image from "next/image";
import StoreBadges from "./StoreBadges";
import { withBasePath } from "@/lib/basePath";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Press kit" },
      { href: "mailto:hello@chaserai.app", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
      { href: "#", label: "Security" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-12">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image
            src={withBasePath("/chaser-logo.svg")}
            alt="chaserAI"
            width={180}
            height={42}
            style={{ height: 42, width: "auto" }}
          />
          <p className="mt-4 text-sm text-[var(--muted)] max-w-xs leading-relaxed">
            AI-powered desktop search. Private by default. Built for the way you actually think about your files.
          </p>
          <div className="mt-5">
            <StoreBadges size="sm" />
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-[var(--muted)]">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[var(--foreground)]/85 hover:text-[var(--accent)] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span>© {new Date().getFullYear()} chaserAI. All rights reserved.</span>
          <span className="font-mono">
            Made for people who lose files. <span className="text-[var(--accent)]">●</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
