import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity } from "@/stores/features/area/action";
import DebounceInput from "@/components/forms/debounce-input";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";

export default function CityPage() {
  const { cities } = useAppSelector((state) => state.area);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCity({}));
  }, []);

  function handleUpdate(code: number, id: number) {
    http
      .patch(`/cities/${id}`, { code: Number(code) })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="text-center">Kota</TableColumn>
          <TableColumn className="text-center">Kode Kota</TableColumn>
          <TableColumn className="text-center">Provinsi</TableColumn>
        </TableHeader>
        <TableBody>
          {(cities?.data! || []).map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-primary-50"
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <DebounceInput
                  value={item.code}
                  onValueChange={(val) => handleUpdate(val, item.id)}
                />
              </TableCell>
              <TableCell>{item.province?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(cities?.data || []).length > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination
            isCompact
            showControls
            initialPage={cities?.current_page}
            radius="full"
            total={cities?.last_page || 0}
            onChange={(page) => {
              dispatch(getCity({ page }));
            }}
          />
        </div>
      )}
    </>
  );
}
