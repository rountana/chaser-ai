import Image from "next/image";
import { withBasePath } from "@/lib/basePath";
import WaitlistButton from "./WaitlistButton";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(10,10,10,0.6)] border-b border-[var(--border)]">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2" aria-label="chaserAI home">
          <Image
            src={withBasePath("/chaser-logo.svg")}
            alt="chaserAI"
            width={160}
            height={36}
            priority
            style={{ height: 36, width: "auto" }}
          />
        </a>

        <ul className="hidden md:flex items-center gap-7 text-sm text-[var(--muted)]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <WaitlistButton label="Join waitlist" variant="outline" size="sm" />
      </nav>
    </header>
  );
}
