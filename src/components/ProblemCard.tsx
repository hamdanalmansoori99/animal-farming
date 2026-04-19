import type { ReactNode } from "react";

export function ProblemCard({
  problem,
  causes,
  action,
  vet,
  labels,
}: {
  problem: string;
  causes: string | ReactNode;
  action: string | ReactNode;
  vet?: string | ReactNode;
  labels: { causes: string; action: string; vet: string };
}) {
  const hasVet =
    vet !== undefined &&
    vet !== null &&
    (typeof vet !== "string" || (vet.trim() !== "" && vet.trim() !== "—"));

  return (
    <div className="not-prose my-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 md:p-6">
      <p className="font-display text-lg text-(--color-foreground) mb-4 leading-tight">
        {problem}
      </p>
      <div className="space-y-3.5">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-(--color-muted) mb-1">
            {labels.causes}
          </p>
          <p className="text-sm leading-relaxed text-(--color-foreground)">
            {causes}
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-(--color-muted) mb-1">
            {labels.action}
          </p>
          <p className="text-sm leading-relaxed text-(--color-foreground)">
            {action}
          </p>
        </div>
        {hasVet && (
          <div className="border-t border-(--color-border) pt-3">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-(--color-rust-500) mb-1">
              {labels.vet}
            </p>
            <p className="text-sm leading-relaxed text-(--color-foreground)">
              {vet}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
