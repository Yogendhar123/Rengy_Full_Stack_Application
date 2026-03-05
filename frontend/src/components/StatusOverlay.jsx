import React, { useEffect } from "react";

/**
 * Props:
 *  open: boolean
 *  variant: 'info' | 'success' | 'error'
 *  title?: string
 *  message?: string
 *  onClose?: () => void
 *  autoDismissMs?: number    // e.g., 3000 for 3s
 *  showSpinner?: boolean     // spinner for 'info'
 */
export function StatusOverlay({
  open,
  variant = "info",
  title,
  message,
  onClose,
  autoDismissMs,
  showSpinner = variant === "info",
}) {
  const tokens = {
    info: {
      ring: "ring-blue-300/40",
      bg: "bg-white/70",
      iconFill: "text-blue-600",
      glow: "from-blue-500/20",
      defaultTitle: "Loading",
      accent: "bg-blue-600",
      shadow: "shadow-[0_10px_30px_rgba(30,64,175,0.25)]",
    },
    success: {
      ring: "ring-emerald-300/40",
      bg: "bg-white/70",
      iconFill: "text-emerald-600",
      glow: "from-emerald-500/20",
      defaultTitle: "Success",
      accent: "bg-emerald-600",
      shadow: "shadow-[0_10px_30px_rgba(16,185,129,0.25)]",
    },
    error: {
      ring: "ring-rose-300/40",
      bg: "bg-white/70",
      iconFill: "text-rose-600",
      glow: "from-rose-500/20",
      defaultTitle: "Error",
      accent: "bg-rose-600",
      shadow: "shadow-[0_10px_30px_rgba(244,63,94,0.25)]",
    },
  }[variant];

  // Auto close
  useEffect(() => {
    if (!open || !autoDismissMs || !onClose) return;
    const t = setTimeout(onClose, autoDismissMs);
    return () => clearTimeout(t);
  }, [open, autoDismissMs, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-[rgba(12,18,28,0.55)] backdrop-blur-[3px]
      "
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={title || tokens.defaultTitle}
    >
      <div
        className={[
          "relative rounded-2xl border border-white/20",
          tokens.bg,
          tokens.shadow,
          "backdrop-blur-xl px-6 py-5",
          "flex flex-col items-center gap-3 min-w-[220px] max-w-[80vw] text-center",
          "transition duration-200 ease-out",
        ].join(" ")}
        tabIndex={-1}
      >
        {/* Soft inner ring */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ${tokens.ring}`}
        />

        {/* Accent halo */}
        <div className="absolute -inset-1 rounded-3xl -z-10">
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${tokens.glow} to-transparent blur-xl`}
          />
        </div>

        {/* Indicator */}
        {showSpinner ? (
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
        ) : (
          <div
            className={[
              "grid place-items-center h-12 w-12 rounded-full",
              "bg-white/70",
              "ring-1 ring-white/40",
            ].join(" ")}
          >
            {variant === "success" && (
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 ${tokens.iconFill}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            {variant === "error" && (
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 ${tokens.iconFill}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6" />
                <path d="M9 9l6 6" />
              </svg>
            )}
            {variant === "info" && (
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 ${tokens.iconFill}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-800">
          {title || tokens.defaultTitle}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-sm text-gray-600 max-w-[28rem]">
            {message}
          </p>
        )}

        {/* Accent bar */}
        <div className={`mt-1 h-1.5 w-16 rounded-full ${tokens.accent} opacity-80`} />

        {/* Optional close button (for errors or long info states) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="
              mt-2 text-xs text-gray-600
              hover:text-gray-900
              underline underline-offset-4
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
              rounded cursor-pointer
            "
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

