import { http } from "@/config/axios";
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

export async function handleDownloadExcel(
  url: string,
  params?: any,
  fileName: string = "export-data",
  onLoading?: (val: boolean) => void,
) {
  try {
    if (onLoading) {
      onLoading(true);
    }
    const response = await http.get(url, {
      responseType: "blob",
      params,
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = fileName + ".xlsx";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Gagal mendownload Excel:", error);
  } finally {
    if (onLoading) {
      onLoading(false);
    }
  }
}