import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  EditIcon,
  ImagePlusIcon,
  LoaderCircleIcon,
  Package2Icon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

import CustomInput from "@/components/forms/custom-input";
import InputNumber from "@/components/forms/custom-input-number";
import CustomSelect from "@/components/forms/custom-select";
import QuillJS from "@/components/forms/quill-js";
import EmptyContent from "@/components/empty-content";
import {
  IProduct,
  IProductCategory,
  IProductShowcase,
  IUom,
} from "@/interface/IEcommerce";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { destroyFile, uploadFile } from "@/utils/helpers/upload-file";

interface IForm {
  id?: number;
  name: string;
  category_id: string;
  subcategory_id: string;
  showcase_id: string;
  uom_id: string;
  rack_location: string;
  price: string;
  stock: string;
  description: string;
  is_active: boolean;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function plainText(html?: string | null) {
  if (!html) return "-";

  return html.replace(/<[^>]*>/g, "").trim() || "-";
}

export default function ProductManagementPage() {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [showcases, setShowcases] = useState<IProductShowcase[]>([]);
  const [uoms, setUoms] = useState<IUom[]>([]);
  const [selected, setSelected] = useState<IProduct>();
  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      id: undefined,
      name: "",
      category_id: "",
      subcategory_id: "",
      showcase_id: "",
      uom_id: "",
      rack_location: "",
      price: "0",
      stock: "0",
      description: "",
      is_active: true,
    },
  });

  const categoryOptions = categories.filter((item) => !item.parent_id);
  const subCategoryOptions = categories.filter(
    (item) => item.parent_id && String(item.parent_id) === watch("category_id"),
  );

  useEffect(() => {
    getProducts();
    getMasters();
  }, []);

  useEffect(() => {
    if (selected) {
      setValue("id", selected.id);
      setValue("name", selected.name);
      setValue(
        "category_id",
        selected.category_id ? String(selected.category_id) : "",
      );
      setValue(
        "subcategory_id",
        selected.subcategory_id ? String(selected.subcategory_id) : "",
      );
      setValue(
        "showcase_id",
        selected.showcase_id ? String(selected.showcase_id) : "",
      );
      setValue("uom_id", selected.uom_id ? String(selected.uom_id) : "");
      setValue("rack_location", selected.rack_location || "");
      setValue("price", String(selected.price || 0));
      setValue("stock", String(selected.stock || 0));
      setValue("description", selected.description || "");
      setValue("is_active", !!selected.is_active);
      setImageUrl(selected.image || "");
      setImageError("");
    } else {
      reset();
      setImageUrl("");
      setImageError("");
    }
  }, [selected]);

  function getMasters() {
    Promise.all([
      http.get("/product-masters/categories"),
      http.get("/product-masters/showcases"),
      http.get("/product-masters/uoms"),
    ])
      .then(([categoriesRes, showcasesRes, uomsRes]) => {
        setCategories(categoriesRes.data);
        setShowcases(showcasesRes.data);
        setUoms(uomsRes.data);
      })
      .catch((err) => notifyError(err));
  }

  function getProducts() {
    http
      .get("/products/admin/list")
      .then(({ data }) => setProducts(data))
      .catch((err) => notifyError(err));
  }

  function handleDelete(id: number) {
    http
      .delete(`/products/${id}`)
      .then(({ data }) => {
        notify(data.message);
        getProducts();
      })
      .catch((err) => notifyError(err));
  }

  async function handleUploadFile(files: File[]) {
    const file = files?.[0];

    if (!file) return;

    setImageUploading(true);
    setImageError("");

    const oldImage = imageUrl;
    const result = await uploadFile(file, "products");

    if (result?.url) {
      setImageUrl(result.url);
      if (oldImage) {
        await destroyFile(oldImage);
      }
    } else {
      notify("Upload gambar gagal, silahkan coba lagi", "error");
    }

    setImageUploading(false);
  }

  async function handleRemoveImage() {
    if (imageUrl) {
      await destroyFile(imageUrl);
      setImageUrl("");
    }
  }

  const onSubmit: SubmitHandler<IForm> = (form) => {
    if (!imageUrl) {
      setImageError("Gambar produk wajib diupload");

      return;
    }

    setLoading(true);
    http
      .post("/products", {
        id: form.id,
        name: form.name,
        image: imageUrl,
        category_id: form.category_id ? Number(form.category_id) : null,
        subcategory_id: form.subcategory_id
          ? Number(form.subcategory_id)
          : null,
        showcase_id: form.showcase_id ? Number(form.showcase_id) : null,
        uom_id: form.uom_id ? Number(form.uom_id) : null,
        rack_location: form.rack_location,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        description: form.description,
        is_active: form.is_active,
      })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        setSelected(undefined);
        reset();
        setImageUrl("");
        setImageError("");
        getProducts();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal isOpen={open} size="3xl" onOpenChange={() => setOpen(false)}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {selected?.id ? "Edit Product" : "Tambah Product"}
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Card className="border border-primary-100 bg-primary-50/40 shadow-none">
                <CardBody className="flex flex-row items-start gap-3 py-4">
                  <Package2Icon className="mt-0.5 text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-gray-700">
                      Form Produk E-Commerce
                    </p>
                    <p className="text-xs text-gray-500">
                      Lengkapi data produk secara detail agar katalog lebih rapi
                      dan mudah dicari user.
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card className="border border-primary-100 shadow-none">
                <CardHeader className="flex-col items-start pb-2">
                  <p className="font-semibold text-gray-700">Gambar Produk</p>
                  <p className="text-xs text-gray-500">
                    Drag & drop gambar produk agar katalog terlihat profesional.
                  </p>
                </CardHeader>
                <CardBody className="pt-2">
                  <Dropzone
                    accept={{
                      "image/*": [],
                    }}
                    maxFiles={1}
                    onDrop={handleUploadFile}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-4 transition ${
                          imageError
                            ? "border-danger bg-danger-50/30"
                            : "border-primary-200 bg-primary-50/20 hover:bg-primary-50/40"
                        }`}
                      >
                        <input {...getInputProps()} />
                        {imageUploading ? (
                          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
                            <LoaderCircleIcon
                              className="animate-spin text-primary"
                              size={30}
                            />
                            <p className="text-sm text-gray-500">
                              Mengupload gambar...
                            </p>
                          </div>
                        ) : imageUrl ? (
                          <div className="space-y-3">
                            <Image
                              alt="Preview Product"
                              className="h-[220px] w-full rounded-lg object-cover"
                              src={imageUrl}
                            />
                            <div className="flex gap-2">
                              <Button fullWidth size="sm">
                                Ganti Gambar
                              </Button>
                              <Button
                                fullWidth
                                color="danger"
                                size="sm"
                                variant="light"
                                onPress={handleRemoveImage}
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                            <ImagePlusIcon className="text-primary" size={34} />
                            <div>
                              <p className="font-medium text-gray-700">
                                Drop gambar di sini atau klik untuk upload
                              </p>
                              <p className="text-xs text-gray-500">
                                Format JPG/PNG, rekomendasi rasio 1:1 atau 4:3
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  {imageError && (
                    <p className="mt-2 text-xs text-danger">{imageError}</p>
                  )}
                </CardBody>
              </Card>

              <Card className="border border-primary-100 shadow-none">
                <CardHeader className="flex-col items-start pb-2">
                  <p className="font-semibold text-gray-700">
                    Informasi Produk
                  </p>
                  <p className="text-xs text-gray-500">
                    Field utama dibuat ringkas dengan 2-3 kolom agar lebih cepat
                    diisi.
                  </p>
                </CardHeader>
                <CardBody className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div className="md:col-span-2 lg:col-span-3">
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <CustomInput
                          {...field}
                          errorMessage={
                            errors.name?.message || "Nama produk wajib diisi"
                          }
                          isInvalid={!!errors.name}
                          label="Nama Produk"
                        />
                      )}
                      rules={{ required: true }}
                    />
                  </div>

                  <Controller
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        errorMessage={
                          errors.price?.message || "Harga wajib diisi"
                        }
                        isInvalid={!!errors.price}
                        label="Harga"
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={(val) =>
                          field.onChange(String(val ?? 0))
                        }
                      />
                    )}
                    rules={{ required: true }}
                  />
                  <Controller
                    control={control}
                    name="stock"
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        errorMessage={
                          errors.stock?.message || "Stok wajib diisi"
                        }
                        isInvalid={!!errors.stock}
                        label="Stok"
                        labelPlacement="outside"
                        variant="bordered"
                        onValueChange={(val) =>
                          field.onChange(String(val ?? 0))
                        }
                      />
                    )}
                    rules={{ required: true }}
                  />
                  <Controller
                    control={control}
                    name="rack_location"
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        description="Contoh: Rak A-02-03"
                        label="Lokasi Rak"
                        placeholder="Masukan lokasi rak"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="showcase_id"
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        label="Etalase"
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {showcases
                          .filter((item) => item.is_active)
                          .map((item) => (
                            <SelectItem key={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </CustomSelect>
                    )}
                  />
                  <Controller
                    control={control}
                    name="uom_id"
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        label="UOM"
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {uoms
                          .filter((item) => item.is_active)
                          .map((item) => (
                            <SelectItem key={String(item.id)}>
                              {item.name} ({item.code})
                            </SelectItem>
                          ))}
                      </CustomSelect>
                    )}
                  />
                  <div className="flex items-end pb-2">
                    <Controller
                      control={control}
                      name="is_active"
                      render={({ field }) => (
                        <Switch
                          color="success"
                          isSelected={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          Produk Aktif
                        </Switch>
                      )}
                    />
                  </div>

                  <Controller
                    control={control}
                    name="category_id"
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        label="Kategori"
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("subcategory_id", "");
                        }}
                      >
                        {categoryOptions.map((item) => (
                          <SelectItem key={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </CustomSelect>
                    )}
                  />
                  <Controller
                    control={control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        isDisabled={!watch("category_id")}
                        label="Subkategori"
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {subCategoryOptions.map((item) => (
                          <SelectItem key={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </CustomSelect>
                    )}
                  />
                </CardBody>
              </Card>

              <Card className="border border-primary-100 shadow-none">
                <CardHeader className="pb-1">
                  <p className="font-semibold text-gray-700">
                    Deskripsi Produk
                  </p>
                </CardHeader>
                <CardBody>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <QuillJS
                        height={250}
                        label="Deskripsi Produk"
                        value={field.value}
                        onContent={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setOpen(false)}>
                Batal
              </Button>
              <Button color="primary" isLoading={loading} type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <p className="text-lg font-bold">Manage Product</p>
            <p className="text-sm text-gray-500">
              Kelola katalog produk untuk ditampilkan di e-commerce user.
            </p>
          </div>
          <Button
            color="primary"
            startContent={<PlusCircleIcon size={16} />}
            onPress={() => {
              setSelected(undefined);
              reset();
              setOpen(true);
            }}
          >
            Tambah Product
          </Button>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Produk</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn>Stok</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent={<EmptyContent />}>
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <Image
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          src={item.image}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-500">
                          No Img
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.uom?.name || "-"}{" "}
                          {item.uom?.code ? `(${item.uom?.code})` : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatRupiah(Number(item.price))}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <Chip
                      color={item.is_active ? "success" : "default"}
                      variant="dot"
                    >
                      {item.is_active ? "aktif" : "nonaktif"}
                    </Chip>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-xs text-gray-500">
                      {item.showcase?.name || "-"} |{" "}
                      {item.category?.name || "-"}{" "}
                      {item.subcategory?.name
                        ? `> ${item.subcategory?.name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rak: {item.rack_location || "-"}
                    </p>
                    <p className="line-clamp-2">
                      {plainText(item.description)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                      >
                        <EditIcon className="text-warning" size={17} />
                      </Button>
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() =>
                          confirmSweet(() => handleDelete(item.id))
                        }
                      >
                        <Trash2Icon className="text-danger" size={17} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
