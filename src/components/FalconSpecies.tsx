"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FalconSpecies = "saker" | "peregrine" | "gyrfalcon";
const SPECIES: readonly FalconSpecies[] = ["saker", "peregrine", "gyrfalcon"] as const;
const STORAGE_KEY = "falconSpecies";
const DEFAULT_SPECIES: FalconSpecies = "saker";

type Ctx = {
  species: FalconSpecies;
  setSpecies: (s: FalconSpecies) => void;
  hydrated: boolean;
};

const FalconSpeciesContext = createContext<Ctx>({
  species: DEFAULT_SPECIES,
  setSpecies: () => {},
  hydrated: false,
});

function isFalconSpecies(v: unknown): v is FalconSpecies {
  return typeof v === "string" && (SPECIES as readonly string[]).includes(v);
}

export function FalconSpeciesProvider({ children }: { children: ReactNode }) {
  const [species, setSpeciesState] = useState<FalconSpecies>(DEFAULT_SPECIES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isFalconSpecies(saved)) setSpeciesState(saved);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  function setSpecies(s: FalconSpecies) {
    setSpeciesState(s);
    try {
      localStorage.setItem(STORAGE_KEY, s);
    } catch {
      /* ignore */
    }
  }

  return (
    <FalconSpeciesContext.Provider value={{ species, setSpecies, hydrated }}>
      {children}
    </FalconSpeciesContext.Provider>
  );
}

const LABELS: Record<"ar" | "en", Record<FalconSpecies, string>> = {
  ar: { saker: "الحرّ", peregrine: "الشاهين", gyrfalcon: "الجير" },
  en: { saker: "Saker", peregrine: "Peregrine", gyrfalcon: "Gyrfalcon" },
};

export function FalconSpeciesTabs({
  locale,
  selectorLabel,
}: {
  locale: "ar" | "en";
  selectorLabel?: string;
}) {
  const { species, setSpecies } = useContext(FalconSpeciesContext);
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
        aria-label={selectorLabel ?? "Falcon species"}
        className="inline-flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-1"
      >
        {SPECIES.map((id) => {
          const active = species === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSpecies(id)}
              className={
                active
                  ? "rounded-full bg-(--color-accent-strong) px-4 py-1.5 text-sm font-medium text-(--color-background) transition-colors"
                  : "rounded-full px-4 py-1.5 text-sm text-(--color-foreground) hover:bg-(--color-surface-elevated) transition-colors"
              }
            >
              {labels[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SpeciesOnly({
  species,
  children,
}: {
  species: FalconSpecies | FalconSpecies[];
  children: ReactNode;
}) {
  const { species: current, hydrated } = useContext(FalconSpeciesContext);
  // Pre-hydration: show only the default so SSR + first paint match
  const effective = hydrated ? current : DEFAULT_SPECIES;
  const allowed = Array.isArray(species) ? species : [species];
  if (!allowed.includes(effective)) return null;
  return <>{children}</>;
}
