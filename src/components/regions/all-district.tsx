import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

interface Props {
  value: number | undefined;
  setValue: (val: any) => void;
  onSelectItem?: (item: { id: number; name: string } | null) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function AllDistrictList({
  value,
  setValue,
  onSelectItem,
  isRequired,
  isInvalid,
  errorMessage,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [list, seList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (value && list.length) {
      const selected = list.find((e: any) => e.id == value);

      if (selected) {
        setInputValue((selected as any).name);
      }
    }
  }, [value, list]);

  function getData() {
    http
      .get(`districts?type=merge`)
      .then(({ data }) => {
        seList(data);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Autocomplete
      defaultItems={list}
      errorMessage={errorMessage}
      inputValue={inputValue}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label="Regional"
      labelPlacement="outside"
      placeholder="Pilih Regional"
      selectedKey={value != null ? String(value) : null}
      variant="bordered"
      onInputChange={setInputValue}
      onSelectionChange={(key) => {
        setValue(key);
        const item = list.find((e: any) => String(e.id) === String(key)) as
          | { id: number; name: string }
          | undefined;
        onSelectItem?.(item ? { id: item.id, name: item.name } : null);
      }}
    >
      {(item: any) => (
        <AutocompleteItem
          key={String(item.id)}
          className="capitalize"
          textValue={item.name}
        >
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
