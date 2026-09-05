import Swal from "sweetalert2";

export const alerts = Swal.mixin({
  confirmButtonColor: "#1f3d32",
  cancelButtonColor: "#687168",
  confirmButtonText: "Entendido",
  background: "#f4f2ec",
  color: "#10130f",
  customClass: { popup: "suriaco-alert", confirmButton: "suriaco-alert-button", cancelButton: "suriaco-alert-button" }
});

export function notifyError(text: string | null) {
  if (text) void alerts.fire({ icon: "error", title: "No se pudo completar", text });
}

export function notifySuccess(text: string | null) {
  if (text) void alerts.fire({ icon: "success", title: "Listo", text });
}

export function notifyInfo(text: string | null) {
  if (text) void alerts.fire({ icon: "info", title: "Ubicación de la actividad", text });
}
