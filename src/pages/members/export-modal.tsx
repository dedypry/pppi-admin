import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import {
  MEMBER_EXPORT_FIELDS,
  MemberExportFieldKey,
} from "./export-fields";

interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onExport: (fields: MemberExportFieldKey[]) => void;
}

export default function ExportMembersModal({
  isOpen,
  isLoading,
  onClose,
  onExport,
}: Props) {
  const allKeys = useMemo(
    () => MEMBER_EXPORT_FIELDS.map((f) => f.key),
    [],
  );
  const [selected, setSelected] = useState<string[]>([...allKeys]);

  useEffect(() => {
    if (isOpen) {
      setSelected([...allKeys]);
    }
  }, [isOpen, allKeys]);

  const allSelected = selected.length === allKeys.length;

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-gray-800">Export Excel</p>
          <p className="text-sm font-normal text-gray-500">
            Pilih field yang ingin diexport. Bisa semua atau custom.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              {selected.length} dari {allKeys.length} field dipilih
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={() => setSelected([...allKeys])}
              >
                Pilih Semua
              </Button>
              <Button
                size="sm"
                variant="light"
                onPress={() => setSelected([])}
              >
                Hapus Semua
              </Button>
            </div>
          </div>

          <Checkbox
            className="mb-2"
            isSelected={allSelected}
            onValueChange={(checked) => {
              setSelected(checked ? [...allKeys] : []);
            }}
          >
            Semua Field
          </Checkbox>

          <CheckboxGroup
            classNames={{
              wrapper: "grid grid-cols-1 gap-2 sm:grid-cols-2",
            }}
            value={selected}
            onValueChange={setSelected}
          >
            {MEMBER_EXPORT_FIELDS.map((field) => (
              <Checkbox key={field.key} value={field.key}>
                {field.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button
            color="success"
            isDisabled={selected.length === 0}
            isLoading={isLoading}
            onPress={() => onExport(selected as MemberExportFieldKey[])}
          >
            Export ({selected.length})
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
