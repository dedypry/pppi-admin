import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

interface Props {
  value: number | undefined;
  setValue: (val: any) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function AllDistrictList({
  value,
  setValue,
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
      selectedKey={value}
      variant="bordered"
      onInputChange={setInputValue}
      onSelectionChange={setValue}
    >
      {(item: any) => (
        <AutocompleteItem key={item.id} className="capitalize">
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
