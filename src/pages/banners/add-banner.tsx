import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

import DropZone from "@/components/drop-zone";
import { uploadMultipleFile } from "@/utils/helpers/upload-file";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";
import { useAppDispatch } from "@/stores/hooks";
import { getBanner } from "@/stores/features/banners/action";

export default function AddBanner() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setFiles([]);
    }
  }, [isOpen]);

  async function handleSubmit() {
    setLoading(true);

    try {
      const { urls } = await uploadMultipleFile(files);
      const { data } = await http.post("/banners", { urls });

      dispatch(getBanner());
      notify(data.message);
      setIsOpen(false);
    } catch (error) {
      notifyError(error as any);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} size="5xl" onOpenChange={() => setIsOpen(!isOpen)}>
        <ModalContent>
          <ModalHeader>Tambah banner Baru</ModalHeader>
          <ModalBody>
            <DropZone files={files} setFiles={setFiles} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button color="primary" isLoading={loading} onPress={handleSubmit}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button color="primary" onPress={() => setIsOpen(true)}>
        Tambah Banner
      </Button>
    </>
  );
}
