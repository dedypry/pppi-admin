import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { http } from "@/config/axios";

interface Props {
  value: string | undefined;
  setValue: (val: any) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function ProvinceList({
  value,
  setValue,
  isRequired,
  isInvalid,
  errorMessage,
}: Props) {
  const [list, seList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    http
      .get("provinces")
      .then(({ data }) => {
        seList(data.map((e: any) => ({ value: e.id, label: e.name })));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Autocomplete
      defaultItems={list}
      errorMessage={errorMessage}
      inputValue={(list.find((e: any) => e.id == value) as any)?.name}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label="Provinsi"
      labelPlacement="outside"
      placeholder="Pilih Provinsi"
      selectedKey={value}
      variant="bordered"
      onSelectionChange={setValue}
    >
      {(item: any) => (
        <AutocompleteItem
          key={item.value}
          className="capitalize"
          textValue={item.label}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
