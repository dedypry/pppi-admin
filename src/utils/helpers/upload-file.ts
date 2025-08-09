import { galery } from "@/config/axios";

export async function uploadFile(file: File, folder: string = "general") {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const { data } = await galery.post(`/?folder=${folder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}
export async function uploadMultipleFile(
  files: File[],
  folder: string = "general",
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const { data } = await galery.post(`/multiple?folder=${folder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function destroyFile(url: string) {
  try {
    const { data } = await galery({
      url: "",
      method: "DELETE",
      data: { url },
    });

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}
