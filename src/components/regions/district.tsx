import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

interface Props {
  value: number | undefined;
  cityId: number | undefined;
  setValue: (val: any) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function DistrictList({
  value,
  setValue,
  cityId,
  isRequired,
  isInvalid,
  errorMessage,
}: Props) {
  const [list, seList] = useState([]);

  useEffect(() => {
    getData();
  }, [cityId]);

  function getData() {
    if (cityId) {
      http
        .get(`districts/${cityId}`)
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
      label="Kecamatan"
      labelPlacement="outside"
      placeholder="Pilih Kecamatan"
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
