import { NumberInput, NumberInputProps } from "@heroui/react";
import { forwardRef } from "react";

function CustomInputNumber(
  props: NumberInputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <NumberInput
      ref={ref}
      hideStepper
      classNames={{
        label: "text-gray-800",
        description: "text-gray-400 italic text-xs",
      }}
      color="primary"
      labelPlacement="outside"
      min={0}
      variant="bordered"
      {...props}
    />
  );
}

export default forwardRef(CustomInputNumber);
