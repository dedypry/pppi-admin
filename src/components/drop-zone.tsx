import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import Dropzone from "react-dropzone";

interface Props {
  files: File[];
  setFiles: CallableFunction;
}
export default function DropZone({ files, setFiles }: Props) {
  const handleDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(
      (file) =>
        !files.some((f) => f.name === file.name && f.size === file.size),
    );

    setFiles((prev: File[]) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];

    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return (
    <Dropzone accept={{ "image/*": [] }} onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div className="w-full">
          <div
            {...getRootProps()}
            className="cursor-pointer rounded-xl border border-dashed p-5 text-center transition hover:bg-gray-50"
          >
            <input {...getInputProps()} />
            {files.length === 0 ? (
              <>
                <Plus className="mx-auto mb-2" />
                <p className="text-gray-500">
                  Drag & drop or click to select images
                </p>
              </>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {files.map((file, index) => {
                  const preview = URL.createObjectURL(file);

                  return (
                    <Card key={index} className="border-none" radius="lg">
                      <Image
                        alt={file.name}
                        className="h-40 w-full object-cover"
                        src={preview}
                      />
                      <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                        <Button
                          color="danger"
                          radius="lg"
                          size="sm"
                          startContent={<Trash2 size={15} />}
                          onPress={() => removeFile(index)}
                        >
                          Delete Banner
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
                <Card className="h-40 w-full" radius="lg">
                  <CardBody className="flex flex-col items-center justify-center bg-primary-50">
                    <Plus className="mx-auto mb-2" />
                    <p className="text-gray-500">Tambah Banner</p>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
}
