import { forwardRef, useState } from "react";
import { InputProps } from "@heroui/react";

import CustomInput from "./custom-input";

import debounce from "@/utils/helpers/debounce";

interface Props {
  onValueChange?: (val: any) => void;
}

const DebounceInput = (
  { onValueChange, ...props }: Props & InputProps,
  ref: React.Ref<HTMLInputElement>,
) => {
  const [query, setQuery] = useState(props.value ?? "");

  const debounceSearch = debounce((val: string) => {
    if (onValueChange) {
      onValueChange(val);
    }
  }, 1000);

  return (
    <CustomInput
      ref={ref}
      {...props}
      value={query}
      onChange={(e) => {
        const val = e.target.value;

        setQuery(val);
        debounceSearch(val);
      }}
    />
  );
};

export default forwardRef(DebounceInput);
