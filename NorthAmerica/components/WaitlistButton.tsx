"use client";

import { useState, type FormEvent } from "react";

const FORM_ACTION = process.env.NEXT_PUBLIC_WAITLIST_FORM_ACTION;
const EMAIL_ENTRY = process.env.NEXT_PUBLIC_WAITLIST_EMAIL_ENTRY;
const PHONE_ENTRY = process.env.NEXT_PUBLIC_WAITLIST_PHONE_ENTRY;

type Mode = "email" | "phone";
type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  label?: string;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-xs px-4 py-1.5",
  md: "text-sm px-5 py-2",
  lg: "text-base px-6 py-3",
};

export default function WaitlistButton({
  label = "Join the waitlist",
  variant = "primary",
  size = "md",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("email");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const close = () => {
    setOpen(false);
    setStatus("idle");
    setValue("");
    setMode("email");
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;

    if (!FORM_ACTION) {
      console.error(
        "Waitlist form is not configured. Set NEXT_PUBLIC_WAITLIST_FORM_ACTION (and _EMAIL_ENTRY / _PHONE_ENTRY) at build time.",
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const entry = mode === "email" ? EMAIL_ENTRY : PHONE_ENTRY;
    const body = new URLSearchParams();
    if (entry) body.set(entry, value.trim());

    try {
      // Google Forms rejects CORS, so this is a fire-and-forget POST — the
      // opaque no-cors response can't confirm the submission actually landed.
      await fetch(FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const variantClasses =
    variant === "primary"
      ? "bg-[var(--accent)] hover:bg-[#bfa6ff] text-[#0a0a0a] font-medium"
      : "border border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--foreground)]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all active:scale-95 ${sizeClasses[size]} ${variantClasses} ${className}`}
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Join the waitlist"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elev)] p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <div className="mx-auto size-10 rounded-full bg-[var(--accent)]/15 flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">You&apos;re on the list.</p>
                <p className="mt-2 text-sm text-[var(--muted)]">We&apos;ll reach out as soon as chaserAI is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold">Join the waitlist</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Be first to know when chaserAI launches.</p>

                <div className="mt-4 inline-flex rounded-full border border-[var(--border-strong)] p-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("email");
                      setValue("");
                      setStatus("idle");
                    }}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      mode === "email" ? "bg-[var(--accent)] text-[#0a0a0a]" : "text-[var(--muted)]"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("phone");
                      setValue("");
                      setStatus("idle");
                    }}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      mode === "phone" ? "bg-[var(--accent)] text-[#0a0a0a]" : "text-[var(--muted)]"
                    }`}
                  >
                    Phone
                  </button>
                </div>

                <input
                  type={mode === "email" ? "email" : "tel"}
                  required
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "email" ? "you@company.com" : "+1 (555) 123-4567"}
                  className="mt-4 w-full rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                />

                {status === "error" && (
                  <p className="mt-2 text-xs text-red-400">
                    Something went wrong. Please try again in a moment.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-4 w-full rounded-full bg-[var(--accent)] hover:bg-[#bfa6ff] disabled:opacity-60 text-[#0a0a0a] text-sm font-medium py-2.5 transition-colors"
                >
                  {status === "submitting" ? "Joining..." : "Join waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
