"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="page-transition" style={{ padding: "3rem" }}>
      <div className="page-header">
        <h1 className="page-title">Oops, something went wrong</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          The app failed to load. This is usually due to a deployment configuration issue.
        </p>
        <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
          If this is the deployed demo, please verify that <code>NEXTAUTH_URL</code>, <code>NEXTAUTH_SECRET</code>, and <code>DATABASE_URL</code> are set.
        </p>
        <button
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "var(--accent-primary)",
            color: "white",
            fontWeight: 600,
          }}
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
