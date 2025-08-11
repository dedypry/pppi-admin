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
import { getCity, getDistrict } from "@/stores/features/area/action";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import DebounceInput from "@/components/forms/debounce-input";

export default function DistrictPage() {
  const { districts } = useAppSelector((state) => state.area);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDistrict({}));
  }, []);

  function handleUpdate(code: number, id: number) {
    http
      .patch(`/districts/${id}`, { code: Number(code) })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="text-center">Kelurahan</TableColumn>
          <TableColumn className="text-center">Kode Kelurahan</TableColumn>
          <TableColumn className="text-center">Kota | Kode</TableColumn>
          <TableColumn className="text-center">Provinsi | Kode</TableColumn>
        </TableHeader>
        <TableBody>
          {(districts?.data! || []).map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-primary-50"
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <DebounceInput
                  value={item.code!}
                  onValueChange={(val) => handleUpdate(val, item.id)}
                />
              </TableCell>
              <TableCell>
                {item.city?.name} | {item.city?.code}
              </TableCell>
              <TableCell>
                {item.city?.province?.name} | {item.city?.province?.code}{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(districts?.data || []).length > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination
            isCompact
            showControls
            initialPage={districts?.current_page}
            radius="full"
            total={districts?.last_page || 0}
            onChange={(page) => {
              dispatch(getCity({ page }));
            }}
          />
        </div>
      )}
    </>
  );
}
