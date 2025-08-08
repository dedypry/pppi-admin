import { Input, InputProps } from "@heroui/react";
import { forwardRef } from "react";

function CustomInput(props: InputProps, ref: React.Ref<HTMLInputElement>) {
  return (
    <Input
      ref={ref}
      classNames={{
        label: "text-gray-800",
        description: "text-gray-400 italic text-xs",
      }}
      color="primary"
      labelPlacement="outside"
      variant="bordered"
      {...props}
    />
  );
}

export default forwardRef(CustomInput);
