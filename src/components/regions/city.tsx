import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

interface Props {
  value: number | undefined;
  provinceId: number | undefined;
  setValue: (val: any) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function CityList({
  value,
  setValue,
  provinceId,
  isRequired,
  isInvalid,
  errorMessage,
}: Props) {
  const [list, seList] = useState([]);

  useEffect(() => {
    getData();
  }, [provinceId]);

  function getData() {
    if (provinceId) {
      http
        .get(`/cities/${provinceId}`)
        .then(({ data }) => {
          seList(data);
        })
        .catch((err) => notifyError(err));
    } else {
      seList([]);
    }
  }

  return (
    <Autocomplete
      defaultItems={list}
      errorMessage={errorMessage}
      inputValue={(list.find((e: any) => e.id == value) as any)?.name}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label="Kota"
      labelPlacement="outside"
      placeholder="Pilih Kota"
      selectedKey={value}
      variant="bordered"
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
