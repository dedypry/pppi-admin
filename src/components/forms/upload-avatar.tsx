import { Avatar, Button } from "@heroui/react";
import { useRef } from "react";

import { uploadFile } from "@/utils/helpers/upload-file";

interface Props {
  file: any;
  setFile: CallableFunction;
  post?: () => void;
  label?: string;
  showButtonUpload?: boolean;
}
export default function UploadAvatar({
  file,
  setFile,
  post,
  label,
  showButtonUpload = false,
}: Props) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { url } = await uploadFile(e.target.files[0], "avatar");

      setFile(url);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex justify-center gap-2">
      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />

      <Avatar
        isBordered
        className="h-32 w-32 cursor-pointer"
        src={
          file instanceof File
            ? URL.createObjectURL(file)
            : (file as string) || ""
        }
        onClick={() => fileInputRef.current?.click()}
      />

      <div className="flex flex-col gap-1 self-center">
        {label && <p className="text-xs italic text-gray-400">{label}</p>}

        <Button
          className="px-10"
          radius="full"
          size="sm"
          onPress={() => setFile("")}
        >
          Reset
        </Button>
        {showButtonUpload && (
          <Button
            className="bg-info px-10"
            radius="full"
            size="sm"
            onPress={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        )}

        {post && (
          <Button
            className="px-10"
            color="primary"
            radius="full"
            size="sm"
            onPress={post}
          >
            Simpan
          </Button>
        )}
      </div>
    </div>
  );
}
