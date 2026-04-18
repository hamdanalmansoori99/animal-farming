"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SupplementMode = "organic" | "pharmaceutical";
const MODES: readonly SupplementMode[] = ["organic", "pharmaceutical"] as const;
const STORAGE_KEY = "supplementMode";
const DEFAULT_MODE: SupplementMode = "organic";

type Ctx = {
  mode: SupplementMode;
  setMode: (m: SupplementMode) => void;
  hydrated: boolean;
};

const SupplementModeContext = createContext<Ctx>({
  mode: DEFAULT_MODE,
  setMode: () => {},
  hydrated: false,
});

function isMode(v: unknown): v is SupplementMode {
  return typeof v === "string" && (MODES as readonly string[]).includes(v);
}

export function SupplementModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SupplementMode>(DEFAULT_MODE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isMode(saved)) setModeState(saved);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  function setMode(m: SupplementMode) {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  }

  return (
    <SupplementModeContext.Provider value={{ mode, setMode, hydrated }}>
      {children}
    </SupplementModeContext.Provider>
  );
}

const LABELS: Record<"ar" | "en", Record<SupplementMode, string>> = {
  ar: { organic: "عضوي", pharmaceutical: "دوائي" },
  en: { organic: "Organic", pharmaceutical: "Pharmaceutical" },
};

export function SupplementModeTabs({
  locale,
  selectorLabel,
}: {
  locale: "ar" | "en";
  selectorLabel?: string;
}) {
  const { mode, setMode } = useContext(SupplementModeContext);
  const labels = LABELS[locale];

  return (
    <div className="my-8 not-prose">
      {selectorLabel && (
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-(--color-muted)">
          {selectorLabel}
        </p>
      )}
      <div
        role="tablist"
        aria-label={selectorLabel ?? "Supplement mode"}
        className="inline-flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-1"
      >
        {MODES.map((id) => {
          const active = mode === id;
          const isPharma = id === "pharmaceutical";
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMode(id)}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-(--color-accent-strong) px-4 py-1.5 text-sm font-medium text-(--color-background) transition-colors"
                  : "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm text-(--color-foreground) hover:bg-(--color-surface-elevated) transition-colors"
              }
            >
              {isPharma && (
                <span aria-hidden className="text-xs leading-none">
                  ⚠
                </span>
              )}
              {labels[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ModeOnly({
  mode,
  children,
}: {
  mode: SupplementMode;
  children: ReactNode;
}) {
  const { mode: current, hydrated } = useContext(SupplementModeContext);
  const effective = hydrated ? current : DEFAULT_MODE;
  if (effective !== mode) return null;
  return <>{children}</>;
}

export function TimingEntry({
  situation,
  organic,
  pharmaceutical,
  labels,
}: {
  situation: string;
  organic: string;
  pharmaceutical?: string;
  labels: { firstLine: string; vet: string };
}) {
  const hasVet = pharmaceutical && pharmaceutical.trim() !== "" && pharmaceutical.trim() !== "—";
  return (
    <div className="not-prose my-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 md:p-6">
      <p className="font-display text-lg text-(--color-foreground) mb-4 leading-tight">
        {situation}
      </p>
      <div className="space-y-3.5">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-(--color-muted) mb-1">
            {labels.firstLine}
          </p>
          <p className="text-sm leading-relaxed text-(--color-foreground)">
            {organic}
          </p>
        </div>
        {hasVet && (
          <div className="border-t border-(--color-border) pt-3">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-(--color-rust-500) mb-1">
              {labels.vet}
            </p>
            <p className="text-sm leading-relaxed text-(--color-foreground)">
              {pharmaceutical}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PharmaceuticalWarning({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="not-prose my-6 rounded-2xl border border-(--color-rust-500)/40 bg-(--color-rust-500)/10 p-4 md:p-5"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--color-rust-500) text-(--color-background) text-sm font-bold"
        >
          !
        </span>
        <p className="text-sm leading-relaxed text-(--color-foreground)">
          {message}
        </p>
      </div>
    </div>
  );
}
