import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Pagination,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CustomInput from "@/components/forms/custom-input";
import CustomSelect from "@/components/forms/custom-select";
import EmptyContent from "@/components/empty-content";
import PageSize from "@/components/page-size";
import { http } from "@/config/axios";
import { IShopOrder } from "@/interface/IEcommerce";
import { IPagination } from "@/interface/IPagination";
import { useAppDispatch } from "@/stores/hooks";
import {
  getShopOrderNotifications,
  readShopOrderNotifications,
} from "@/stores/features/shop-orders/action";
import { dateTimeFormat } from "@/utils/helpers/formater";
import { notifyError } from "@/utils/helpers/notify";
import debounce from "@/utils/helpers/debounce";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const statusColor = {
  pending: "warning",
  processing: "primary",
  completed: "success",
  cancelled: "danger",
} as const;

export default function TransactionPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [query, setQuery] = useState({
    q: "",
    pageSize: "10",
    page: 1,
    status: "all",
    ...Object.fromEntries(queryParams.entries()),
  });
  const [transactions, setTransactions] = useState<IPagination<IShopOrder[]> | null>(
    null,
  );
  const route = useNavigate();
  const dispatch = useAppDispatch();

  const debounceSearch = debounce(
    (val: string) => setQueryParams("q", val),
    500,
  );

  useEffect(() => {
    getTransactions();
    dispatch(readShopOrderNotifications([]));
    dispatch(getShopOrderNotifications());
  }, []);

  useEffect(() => {
    getTransactions();
    const params = new URLSearchParams(query as any).toString();
    route(`?${params}`, { replace: true });
  }, [query]);

  function setQueryParams(key: string, value: string | number) {
    setQuery((val) => ({
      ...val,
      [key]: value,
      ...(key === "q" && {
        page: 1,
      }),
    }));
  }

  function getTransactions() {
    http
      .get(
        `/shop-orders/admin/transactions?page=${query.page}&pageSize=${query.pageSize}&q=${encodeURIComponent(query.q || "")}&status=${query.status}`,
      )
      .then(({ data }) => setTransactions(data))
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between gap-2">
          <div>
            <p className="text-lg font-bold">Transaksi Order</p>
            <p className="text-sm text-gray-500">
              Kelola order masuk dari e-commerce user.
            </p>
          </div>
          <div className="flex gap-2">
            <PageSize
              setSize={(val) => setQueryParams("pageSize", val)}
              size={query.pageSize}
            />
            <CustomSelect
              className="w-36"
              label="Status"
              selectedKeys={[query.status]}
              onChange={(e) => setQueryParams("status", e.target.value)}
            >
              <SelectItem key="all">all</SelectItem>
              <SelectItem key="pending">pending</SelectItem>
              <SelectItem key="processing">processing</SelectItem>
              <SelectItem key="completed">completed</SelectItem>
              <SelectItem key="cancelled">cancelled</SelectItem>
            </CustomSelect>
            <CustomInput
              defaultValue={query.q}
              endContent={<SearchIcon className="text-gray-500" />}
              placeholder="Cari kode / nama / email"
              onChange={(e) => debounceSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Kode</TableColumn>
              <TableColumn>Pelanggan</TableColumn>
              <TableColumn>Kontak</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Waktu</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {(transactions?.data || []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.order_code}</TableCell>
                  <TableCell>{item.customer_name}</TableCell>
                  <TableCell>
                    <p className="text-xs">{item.customer_email}</p>
                    <p className="text-xs text-gray-500">{item.customer_phone}</p>
                  </TableCell>
                  <TableCell>{formatRupiah(Number(item.total_amount))}</TableCell>
                  <TableCell>
                    <Chip color={statusColor[item.status] as any} variant="dot">
                      {item.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{dateTimeFormat(item.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => route(`/ecommerce/transactions/${item.id}`)}
                    >
                      <EyeIcon size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        {(transactions?.data || []).length > 0 && (
          <CardFooter className="flex justify-between">
            <p className="font-bold text-gray-600">
              Total : {transactions?.total || 0} Data
            </p>
            <Pagination
              isCompact
              showControls
              initialPage={transactions?.current_page}
              radius="full"
              total={transactions?.last_page || 1}
              onChange={(page) => setQueryParams("page", page)}
            />
          </CardFooter>
        )}
      </Card>
    </>
  );
}
