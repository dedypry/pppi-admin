import { SelectItem } from "@heroui/react";

import CustomSelect from "./forms/custom-select";

interface Props {
  size: string;
  setSize: (val: string) => void;
}
export default function PageSize({ size, setSize }: Props) {
  const pages = ["5", "10", "25", "50", "100"];

  return (
    <CustomSelect
      className="w-32"
      label="Page Size"
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
