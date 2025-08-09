import { Autocomplete, AutocompleteProps } from "@heroui/react";

export default function CustomAutoComplete({ ...props }: AutocompleteProps) {
  return (
    <Autocomplete
      classNames={{
        base: "text-gray-800",
      }}
      color="primary"
      labelPlacement="outside"
      variant="bordered"
      {...props}
    />
  );
}
