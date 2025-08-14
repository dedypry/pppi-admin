import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

export function notify(msg: string, type: "success" | "error" = "success") {
  addToast({
    title: type === "success" ? "Sukses" : "Peringatan",
    description: msg,
    color: type === "success" ? "success" : "danger",
  });
}
export function notifyError(res: AxiosError) {
  addToast({
    title: "Peringatan",
    description: (res?.response?.data as any)?.message,
    color: "danger",
  });
}
