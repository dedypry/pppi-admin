import { SelectItem } from "@heroui/react";

import CustomSelect from "./forms/custom-select";

interface Props {
  size: string;
  setSize: (val: string) => void;
  className?: string;
}
export default function PageSize({ size, setSize, className }: Props) {
  const pages = ["5", "10", "25", "50", "100"];

  return (
    <CustomSelect
      className={className || "w-32"}
      label="Page Size"
      labelPlacement="inside"
      placeholder="select size"
      selectedKeys={[size]}
      onChange={(e) => setSize(e.target.value)}
    >
      {pages.map((page) => (
        <SelectItem key={String(page)}>{page}</SelectItem>
      ))}
    </CustomSelect>
  );
}
