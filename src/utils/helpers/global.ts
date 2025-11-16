import { notify } from "./notify";

export function chipColor(status: string) {
  let color = "";

  if (status === "approved") {
    color = "success";
  } else if (status == "rejected") {
    color = "danger";
  } else {
    color = "secondary";
  }

  return color;
}

export async function copyClipboard(text: any) {
  if (!navigator.clipboard) {
    // fallback lama
    const textarea = document.createElement("textarea");

    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    notify("Berhasil di Copy (fallback)");

    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    notify("Berhasil di Copy");
  } catch (error) {
    console.error("Copy failed", error);
    notify("Gagal copy");
  }
}
