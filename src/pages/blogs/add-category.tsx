import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { FilePlus } from "lucide-react";

import ModalCategory from "../blog-category/modal-category";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/categories/actions";

interface Props {
  value: any;
  setValue: CallableFunction;
  isInvalid: boolean;
  errorMessage?: string;
}
export default function AddCategory({
  value,
  setValue,
  isInvalid,
  errorMessage,
}: Props) {
  const [open, setOpen] = useState(false);
  const { categories } = useAppSelector((state) => state.categories);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories({ pageSize: 100 }));
  }, []);

  return (
    <>
      <ModalCategory
        isOpen={open}
        setOpen={setOpen}
        onSuccess={(data: any) => {
          setValue(data.id);
        }}
      />
      <Autocomplete
        isRequired
        errorMessage={errorMessage}
        inputValue={
          (categories?.data.find((e: any) => e.id == value) as any)?.name
        }
        isInvalid={isInvalid}
        items={[
          ...(categories?.data || []),
          { id: "new", name: "New Categories" },
        ]}
        label="Kategori"
        labelPlacement="outside"
        placeholder="Pilih Kategori"
        selectedKey={value}
        variant="bordered"
        onSelectionChange={(key) => {
          if (key === "new") {
            setOpen(true);
          } else {
            setValue(key);
          }
        }}
      >
        {(item: any) => {
          if (item.id === "new") {
            return (
              <AutocompleteItem
                key={String(item.id)}
                color="primary"
                startContent={<FilePlus className="text-sm" />}
              >
                {item.name}
              </AutocompleteItem>
            );
          }

          return (
            <AutocompleteItem key={String(item.id)}>
              {item.name}
            </AutocompleteItem>
          );
        }}
      </Autocomplete>
    </>
  );
}
