/**
 * Clone-Safe Anti-Inspect & Anti-Copy Protection
 *
 * Designed for wedding invitation websites.
 * Default: active (isSecured = true)
 * Override: set VITE_IS_SECURED=false to disable for frontend debugging.
 *
 * Principle: Zero performance & UX impact.
 */

// 1. Centralized isSecured flag
// Semantics:
// - Not set / undefined: true
// - "false" (exact string): false
// - Any other value / empty: true
const rawEnv =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_IS_SECURED
    : undefined;

export const isSecured: boolean = rawEnv !== "false";

// Helper: safe check for browser environment
export function isClientEnv(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// Helper: check if running inside an iframe (e.g. riungin.id catalog preview)
export function isInIframe(): boolean {
  if (!isClientEnv()) return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

// Helper: check if device is mobile or touch device
export function isMobileDevice(): boolean {
  if (!isClientEnv()) return false;
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTouch = typeof navigator !== "undefined" && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
  return isMobileUA || (isTouch && window.innerWidth <= 1024);
}

// Helper: check if target element is editable (input, textarea, select, contenteditable)
export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if ((target as HTMLElement).isContentEditable) return true;
  let curr: Element | null = target.parentElement;
  while (curr) {
    const pTag = curr.tagName.toLowerCase();
    if (pTag === "input" || pTag === "textarea" || pTag === "select") return true;
    if ((curr as HTMLElement).isContentEditable) return true;
    if (curr.getAttribute("contenteditable") === "true") return true;
    curr = curr.parentElement;
  }
  return false;
}

// Helper: check if element is explicitly permitted for contextmenu
// (e.g. forms, links, buttons, bank accounts, copyable addresses, interactive maps)
export function isPermittedForContextMenu(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  if (isEditableElement(target)) return true;
  return (
    target.closest(
      "a, button, form, [data-copyable], .copyable, [data-allow-context='true'], .leaflet-container, .gm-style, iframe"
    ) !== null
  );
}

// Action taken when inspection is detected
export function handleInspectionDetected(): void {
  try {
    document.documentElement.innerHTML = "";
  } catch {
    // ignore
  }
  try {
    window.location.replace("about:blank");
  } catch {
    window.location.href = "about:blank";
  }
}

// Layer 1: Desktop Top-Level Dimension Heuristic (!isInIframe() && !isMobileDevice())
export function checkDesktopDimensionHeuristic(): boolean {
  if (!isClientEnv()) return false;
  if (isInIframe() || isMobileDevice()) return false;

  const diffW = window.outerWidth - window.innerWidth;
  const diffH = window.outerHeight - window.innerHeight;

  // Exclude browser zoom where both width and height diffs exceed threshold simultaneously
  const isZoom = diffW > 160 && diffH > 240;
  if (isZoom) return false;

  return diffW > 160 || diffH > 240;
}

// Layer 2: Dynamic Debugger Timing Delta
// Uses new Function("debugger")() to prevent minifiers (esbuild, Vite, oxc) from removing literal debugger
export function checkDebuggerTimingDelta(): boolean {
  if (!isClientEnv()) return false;
  try {
    const start = performance.now();
    const dbg = new Function("debugger");
    dbg();
    const delta = performance.now() - start;
    return delta > 100;
  } catch {
    return false;
  }
}

// Combined active inspection check
export function checkInspection(): boolean {
  if (!isSecured || !isClientEnv()) return false;

  if (checkDesktopDimensionHeuristic()) {
    handleInspectionDetected();
    return true;
  }

  if (checkDebuggerTimingDelta()) {
    handleInspectionDetected();
    return true;
  }

  return false;
}

// Keyboard shortcuts interception handler
export function handleKeyDown(event: KeyboardEvent): void {
  if (!isSecured) return;

  // Never block shortcuts on input/editable elements
  if (isEditableElement(event.target)) {
    return;
  }

  const key = event.key;
  const keyCode = event.keyCode || event.which;
  const isShift = event.shiftKey;
  const isAltOrOption = event.altKey;

  // 1. F12 (keyCode 123)
  if (key === "F12" || keyCode === 123) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // 2. Windows/Linux: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  //    macOS: Cmd+Option+I, Cmd+Option+J, Cmd+Option+C
  const isInspectKey =
    key === "I" || key === "i" || key === "J" || key === "j" || key === "C" || key === "c";
  if (isInspectKey) {
    if (event.ctrlKey && isShift) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.metaKey && isAltOrOption) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  // 3. Ctrl+U / Cmd+Option+U (View Source)
  if (key === "U" || key === "u") {
    if ((event.ctrlKey && !isShift && !isAltOrOption) || (event.metaKey && isAltOrOption)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
}

// Context menu protection handler
export function handleContextMenu(event: MouseEvent): void {
  if (!isSecured) return;

  // Allow context menu on interactive and copyable elements
  if (isPermittedForContextMenu(event.target)) {
    return;
  }

  // Prevent right-click on decorative presentation and images
  event.preventDefault();
}

// Drag start protection handler (prevent image dragging)
export function handleDragStart(event: DragEvent): void {
  if (!isSecured) return;

  const target = event.target;
  if (
    target instanceof HTMLImageElement ||
    (target instanceof Element && target.tagName.toLowerCase() === "img")
  ) {
    if (!isPermittedForContextMenu(target)) {
      event.preventDefault();
    }
  }
}

// Early evaluation execution (runs as soon as client script is loaded, before render)
if (isClientEnv() && isSecured) {
  checkInspection();
}

/**
 * Initialize protection event listeners and intervals.
 * Safe for React StrictMode, route changes, SSR.
 * Returns cleanup function.
 */
export function initSecurity(): () => void {
  if (!isClientEnv() || !isSecured) {
    return () => {};
  }

  // Check immediately on mount
  checkInspection();

  // Attach event listeners
  window.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("contextmenu", handleContextMenu, true);
  document.addEventListener("dragstart", handleDragStart, true);

  // Resize listener for desktop dimension heuristic
  const handleResize = () => {
    checkInspection();
  };
  window.addEventListener("resize", handleResize, { passive: true });

  // Relaxed interval (1.5s) - 0% CPU consumption, 60fps animations unharmed
  const intervalId = window.setInterval(() => {
    checkInspection();
  }, 1500);

  // Return cleanup function
  return () => {
    window.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("contextmenu", handleContextMenu, true);
    document.removeEventListener("dragstart", handleDragStart, true);
    window.removeEventListener("resize", handleResize);
    window.clearInterval(intervalId);
  };
}
