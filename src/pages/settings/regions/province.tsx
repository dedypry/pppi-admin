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
import { getProvince } from "@/stores/features/area/action";
import DebounceInput from "@/components/forms/debounce-input";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";

export default function ProvincePage() {
  const { provinces } = useAppSelector((state) => state.area);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProvince({}));
  }, []);

  function handleProvince(code: number, id: number) {
    http
      .patch(`/provinces/${id}`, { code: Number(code) })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="text-center">Provinsi</TableColumn>
          <TableColumn className="text-center">Kode Provinsi</TableColumn>
        </TableHeader>
        <TableBody>
          {(provinces?.data! || []).map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-primary-50"
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <DebounceInput
                  value={item.code}
                  onValueChange={(val) => handleProvince(val, item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(provinces?.data || []).length > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination
            isCompact
            showControls
            initialPage={provinces?.current_page}
            radius="full"
            total={provinces?.last_page || 0}
            onChange={(page) => {
              dispatch(getProvince({ page }));
            }}
          />
        </div>
      )}
    </>
  );
}
