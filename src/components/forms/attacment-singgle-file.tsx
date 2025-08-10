import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import { TrashIcon, UploadIcon } from "lucide-react";
import { useRef } from "react";

import { destroyFile, uploadFile } from "@/utils/helpers/upload-file";

interface Props {
  file: any;
  setFile: (val: any) => void;
  label?: string;
  emptyText?: string;
  description?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function AttachmentSingleFile({
  file,
  setFile,
  label,
  emptyText,
  description,
  isInvalid,
  errorMessage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { url } = await uploadFile(e.target.files[0]);

      setFile(url);
    }
  };

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col items-start justify-start">
        {label && <p className={isInvalid ? "text-danger-500" : ""}>{label}</p>}{" "}
        {}{" "}
        {description && (
          <p
            className={`text-sm italic ${isInvalid ? "text-danger-400" : "text-gray-400"}`}
          >
            {description}
          </p>
        )}{" "}
        {}{" "}
      </CardHeader>

      <CardBody
        className="hover:cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {file ? (
          <>
            <Image
              alt="Preview"
              className="max-h-100 w-full rounded-md object-cover"
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : (file as string) || ""
              }
            />
            <div className="absolute right-3 top-0 z-10">
              <Button
                isIconOnly
                className="bg-danger-500 text-white"
                radius="full"
                size="sm"
                startContent={<TrashIcon size={20} />}
                variant="shadow"
                onPress={async () => {
                  await destroyFile(file);
                  setFile("");
                }}
              />
            </div>
          </>
        ) : (
          <div
            className={`flex min-h-[200px] flex-col items-center justify-center gap-5 rounded-md border ${isInvalid ? "border-danger" : ""}`}
          >
            <UploadIcon
              className={`font-bold ${isInvalid ? "text-danger" : ""}`}
              size={50}
            />
            <p
              className={`text-center text-sm ${isInvalid ? "text-danger-400" : "text-gray-400"}`}
            >
              {emptyText || "Upload File"}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </CardBody>
      <CardFooter className="flex flex-col justify-start items-start">
        {isInvalid && errorMessage && (
          <p className="text-xs text-danger">{errorMessage}</p>
        )}
        <p
          className={`italic text-xs ${isInvalid ? "text-danger-400" : "text-gray-400"}`}
        >
          Max Upload File 2MB
        </p>
      </CardFooter>
    </Card>
  );
}
