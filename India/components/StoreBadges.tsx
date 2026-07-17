import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

type Size = "sm" | "md" | "lg";

const heights: Record<Size, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

type Props = {
  size?: Size;
  appStoreHref?: string;
  playStoreHref?: string;
  className?: string;
};

export default function StoreBadges({
  size = "md",
  appStoreHref = "#",
  playStoreHref = "#",
  className = "",
}: Props) {
  const h = heights[size];
  const w = Math.round(h * 3);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={appStoreHref}
        aria-label="Download chaserAI on the App Store"
        className="transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl"
      >
        <Image
          src={withBasePath("/badges/app-store.svg")}
          alt="Download on the App Store"
          width={w}
          height={h}
          priority
          style={{ height: h, width: "auto" }}
        />
      </a>
      <a
        href={playStoreHref}
        aria-label="Get chaserAI on Google Play"
        className="transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl"
      >
        <Image
          src={withBasePath("/badges/play-store.svg")}
          alt="Get it on Google Play"
          width={w}
          height={h}
          priority
          style={{ height: h, width: "auto" }}
        />
      </a>
    </div>
  );
}
