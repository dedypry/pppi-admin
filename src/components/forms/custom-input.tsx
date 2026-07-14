import { Input, InputProps } from "@heroui/react";
import { forwardRef } from "react";

function CustomInput(props: InputProps, ref: React.Ref<HTMLInputElement>) {
  const value = props.value == null ? "" : props.value;

  return (
    <Input
      ref={ref}
      classNames={{
        label: "text-gray-800",
        description: "text-gray-400 italic text-xs",
      }}
      labelPlacement="outside"
      variant="bordered"
      {...props}
      value={value}
    />
  );
}

export default forwardRef(CustomInput);
