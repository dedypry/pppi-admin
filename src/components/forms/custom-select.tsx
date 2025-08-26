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
        label: `text-gray-800 ${!props.labelPlacement || props.labelPlacement == "outside" ? "top-8" : ""}`,
        description: "text-gray-400 italic text-xs",
      }}
      color="primary"
      labelPlacement="outside"
      variant="bordered"
      {...props}
    />
  );
}

export default forwardRef(CustomSelect);
