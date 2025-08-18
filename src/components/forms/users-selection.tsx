import { SelectItem } from "@heroui/react";

import CustomSelect from "./custom-select";

export default function UserSelection() {
  return (
    <CustomSelect label="User List" placeholder="Masukan User">
      <SelectItem>test</SelectItem>
    </CustomSelect>
  );
}
