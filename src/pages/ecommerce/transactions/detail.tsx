import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { AxiosError } from "axios";
import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CustomSelect from "@/components/forms/custom-select";
import { http } from "@/config/axios";
import { IShopOrder } from "@/interface/IEcommerce";
import { useAppDispatch } from "@/stores/hooks";
import { getShopOrderNotifications } from "@/stores/features/shop-orders/action";
import { dateTimeFormat } from "@/utils/helpers/formater";
import { notify, notifyError } from "@/utils/helpers/notify";

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

export default function TransactionDetailPage() {
  const { id } = useParams();
  const route = useNavigate();
  const dispatch = useAppDispatch();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [printingInvoice, setPrintingInvoice] = useState(false);
  const [transaction, setTransaction] = useState<IShopOrder | null>(null);
  const [statusDraft, setStatusDraft] = useState<IShopOrder["status"]>("pending");

  useEffect(() => {
    if (!id) return;

    http
      .get(`/shop-orders/admin/transactions/${id}`)
      .then(({ data }) => {
        setTransaction(data);
        setStatusDraft(data.status);
        dispatch(getShopOrderNotifications());
      })
      .catch((err) => {
        notifyError(err);
        route("/ecommerce/transactions");
      });
  }, [id]);

  function updateStatus(status: IShopOrder["status"]) {
    if (!transaction) return;

    setLoadingStatus(true);
    http
      .patch(`/shop-orders/${transaction.id}/status`, { status })
      .then(({ data }) => {
        notify(data.message);
        setTransaction((prev) => (prev ? { ...prev, status } : prev));
        setStatusDraft(status);
        dispatch(getShopOrderNotifications());
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoadingStatus(false));
  }

  async function handlePrint() {
    if (!transaction) return;

    setPrintingInvoice(true);
    try {
      const { data } = await http.get<Blob>(
        `/shop-orders/admin/transactions/${transaction.id}/invoice`,
        {
          responseType: "blob",
        },
      );

      const blobUrl = URL.createObjectURL(data);
      const printWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");
      if (!printWindow) {
        URL.revokeObjectURL(blobUrl);
        throw new Error(
          "Popup diblokir browser. Mohon izinkan pop-up untuk print invoice.",
        );
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      notifyError(err as AxiosError);
    } finally {
      setPrintingInvoice(false);
    }
  }

  if (!transaction) {
    return (
      <Card>
        <CardBody className="py-10 text-center text-gray-500">
          Memuat detail transaksi...
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="print:hidden">
        <CardHeader className="flex justify-between gap-2">
          <div>
            <p className="text-lg font-bold">Detail Transaksi</p>
            <p className="text-sm text-gray-500">
              Kelola transaksi dan cetak invoice pesanan.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              as={Link}
              startContent={<ArrowLeftIcon size={16} />}
              to="/ecommerce/transactions"
              variant="flat"
            >
              Kembali
            </Button>
            <Button
              color="primary"
              isLoading={printingInvoice}
              startContent={<PrinterIcon size={16} />}
              onPress={handlePrint}
            >
              Print Invoice
            </Button>
          </div>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold text-gray-700">Informasi Order</p>
            <p>Kode: {transaction.order_code}</p>
            <p>Waktu: {dateTimeFormat(transaction.created_at)}</p>
            <p className="mt-1">
              Status:{" "}
              <Chip color={statusColor[transaction.status] as any} size="sm" variant="dot">
                {transaction.status}
              </Chip>
            </p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold text-gray-700">Informasi Pelanggan</p>
            <p>Nama: {transaction.customer_name}</p>
            <p>Email: {transaction.customer_email}</p>
            <p>Telepon: {transaction.customer_phone}</p>
            <p>Alamat: {transaction.shipping_address}</p>
          </div>
        </CardBody>
        <CardFooter className="justify-between">
          <CustomSelect
            className="w-[240px]"
            label="Status Transaksi"
            selectedKeys={[statusDraft]}
            onChange={(e) => setStatusDraft(e.target.value as IShopOrder["status"])}
          >
            <SelectItem key="pending">pending</SelectItem>
            <SelectItem key="processing">processing</SelectItem>
            <SelectItem key="completed">completed</SelectItem>
            <SelectItem key="cancelled">cancelled</SelectItem>
          </CustomSelect>
          <Button isLoading={loadingStatus} onPress={() => updateStatus(statusDraft)}>
            Simpan Status
          </Button>
        </CardFooter>
      </Card>

      <Card className="print:shadow-none">
        <CardHeader className="flex justify-between">
          <div>
            <p className="text-xl font-bold">Invoice</p>
            <p className="text-sm text-gray-500">#{transaction.order_code}</p>
          </div>
          <p className="text-sm">{dateTimeFormat(transaction.created_at)}</p>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Produk</TableColumn>
              <TableColumn>Detail</TableColumn>
              <TableColumn>Qty</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn>Subtotal</TableColumn>
            </TableHeader>
            <TableBody>
              {transaction.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.product?.image ? (
                        <Image
                          alt={item.product_name}
                          className="h-10 w-10 rounded object-cover"
                          src={item.product.image}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                      <p>{item.product_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-600">
                      {item.product?.category?.name || "-"}{" "}
                      {item.product?.subcategory?.name
                        ? `> ${item.product.subcategory.name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-600">
                      Rak: {item.product?.rack_location || "-"} | UOM:{" "}
                      {item.product?.uom?.code || "-"}
                    </p>
                  </TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{formatRupiah(Number(item.price))}</TableCell>
                  <TableCell>{formatRupiah(Number(item.subtotal))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right text-xl font-bold text-primary">
            Total: {formatRupiah(Number(transaction.total_amount))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
