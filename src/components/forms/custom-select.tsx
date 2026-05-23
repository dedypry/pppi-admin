import { Select, SelectProps } from "@heroui/react";
import { forwardRef } from "react";
function CustomSelect(
  { ...props }: SelectProps,
  ref: React.Ref<HTMLSelectElement>,
) {
  return (
    <Select
      ref={ref}
      classNames={{
        label: `text-gray-800 ${!props.labelPlacement || props.labelPlacement == "outside" ? "top-5" : ""}`,
        description: "text-gray-400 italic text-xs",
      }}
      labelPlacement="outside"
      variant="bordered"
      {...props}
    />
  );
}

export default forwardRef(CustomSelect);
