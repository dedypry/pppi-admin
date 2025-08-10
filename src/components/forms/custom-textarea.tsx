import { Textarea, TextAreaProps } from "@heroui/react";
import { forwardRef } from "react";

function CustomTextArea(
  { ...props }: TextAreaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  return (
    <Textarea
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

export default forwardRef(CustomTextArea);
