"use client";

// Catches errors in the root layout itself (before the locale layout runs).
// Next.js requires this file to be a full-page component including <html>
// and <body>, because the root layout has not rendered.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#faf6ee",
          color: "#3d2616",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 72, fontWeight: 700, margin: 0 }}>!</p>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: "1rem 0 0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#7a4f30", lineHeight: 1.6 }}>
            We&rsquo;re sorry — an unexpected error occurred. Please try
            reloading.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              background: "#3d2616",
              color: "#faf6ee",
              border: "none",
              borderRadius: 999,
              padding: "0.6rem 1.5rem",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: 11,
                fontFamily: "ui-monospace, monospace",
                color: "#7a4f30",
              }}
            >
              digest: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
