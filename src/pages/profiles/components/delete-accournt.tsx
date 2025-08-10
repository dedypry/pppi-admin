import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

import InputPassword from "@/components/forms/input-password";

export default function DeleteAccount() {
  const [confirm, setConfirm] = useState(false);
  const [open, setOpen] = useState(false);

  function handleDelete() {}

  return (
    <>
      <Modal isOpen={open} onOpenChange={() => setOpen(!open)}>
        <ModalContent>
          <ModalHeader>Hapus Akun</ModalHeader>
          <ModalBody>
            <InputPassword />
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setOpen(false)}>Batal</Button>
            <Button color="danger" onPress={handleDelete}>
              Hapus Akun
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Card>
        <CardBody className="flex flex-col gap-5">
          <Alert
            color="warning"
            title="Are you sure you want to delete your account?"
          >
            <p className="text-xs italic">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </Alert>
          <Checkbox isSelected={confirm} onValueChange={setConfirm}>
            <p className="text-xs">I confirm my account deactivation</p>
          </Checkbox>
          <div>
            <Button
              className={`mt-2 ${confirm ? "bg-danger-600" : "bg-danger-300"}`}
              color="danger"
              disabled={!confirm}
              variant="shadow"
              onPress={() => setOpen(true)}
            >
              Hapus Akun
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
