"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { alerts } from "@/lib/alerts";

export function ActivityModal({ open, busy, onClose, children }: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const latest = useRef({ busy, onClose });
  latest.current = { busy, onClose };

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (alerts.isVisible()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (!latest.current.busy) latest.current.onClose();
      }
      if (event.key === "Tab") {
        const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []);
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon/70 p-3 backdrop-blur-sm sm:p-6" onClick={(event) => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="activity-modal-title" tabIndex={-1} className="max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-lift outline-none">
        <div className="sticky top-0 z-10 flex justify-end border-b border-carbon/10 bg-white px-5 py-3">
          <button type="button" disabled={busy} onClick={onClose} className="admin-action-button disabled:opacity-40" aria-label="Cerrar formulario de actividad">Cerrar ✕</button>
        </div>
        {children}
      </div>
    </div>, document.body
  );
}
