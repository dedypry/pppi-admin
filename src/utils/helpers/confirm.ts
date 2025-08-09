import Swal, { SweetAlertOptions } from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export function confirmSweet(
  onConfirm: () => void,
  option: SweetAlertOptions = {},
) {
  Swal.fire({
    title: "Apakah Kamu Yakin?",
    text: "Tindakan ini tidak dapat dibatalkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f31260",
    cancelButtonColor: "#15980d",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
    ...option,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}
