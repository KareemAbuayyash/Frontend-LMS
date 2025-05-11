/* global helper — fires a browser CustomEvent picked up by ToastProvider */
export function toast(
  message: string,
  type: "error" | "success" | "info" = "error"
) {
  window.dispatchEvent(
    new CustomEvent("__toast__", { detail: { message, type } })
  );
}
