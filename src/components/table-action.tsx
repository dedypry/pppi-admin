import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  EllipsisVerticalIcon,
  EditIcon,
  Trash2Icon,
  EyeIcon,
} from "lucide-react";

import { confirmSweet } from "@/utils/helpers/confirm";

interface Props {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
export default function TableAction({ onView, onEdit, onDelete }: Props) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="view"
          color="success"
          startContent={<EyeIcon size={18} />}
          onClick={onView}
        >
          Detail
        </DropdownItem>
        <DropdownItem
          key="edit"
          color="warning"
          startContent={<EditIcon size={18} />}
          onClick={onEdit}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          color="danger"
          startContent={<Trash2Icon size={18} />}
          onPress={() => confirmSweet(onDelete)}
        >
          Hapus
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
