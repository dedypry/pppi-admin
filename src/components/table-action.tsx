import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownItemProps,
} from "@heroui/react";
import {
  EditIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  Trash2Icon,
} from "lucide-react";

import { confirmSweet } from "@/utils/helpers/confirm";

interface Props {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dropDown?: {
    item?: DropdownItemProps;
  }[];
}
export default function TableAction({
  onView,
  onEdit,
  onDelete,
  dropDown = [],
}: Props) {
  const items: DropdownItemProps[] = [
    ...dropDown,
    ...(onView
      ? [
          {
            key: "view",
            color: "success",
            startContent: <EyeIcon size={18} />,
            onClick: onView,
            title: "Detail",
          },
        ]
      : []),
    ...(onEdit
      ? [
          {
            key: "edit",
            color: "warning",
            startContent: <EditIcon size={18} />,
            onClick: onEdit,
            title: "Edit",
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            key: "delete",
            color: "danger",
            startContent: <Trash2Icon size={18} />,
            onClick: () => confirmSweet(onDelete),
            title: "Hapus",
          },
        ]
      : []),
  ] as any;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem key={item.key} {...(item as any)}>
            {item.title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
