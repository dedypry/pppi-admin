import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { EditIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import CustomInput from "@/components/forms/custom-input";
import CustomSelect from "@/components/forms/custom-select";
import CustomTextArea from "@/components/forms/custom-textarea";
import EmptyContent from "@/components/empty-content";
import { confirmSweet } from "@/utils/helpers/confirm";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { IProductCategory, IProductShowcase, IUom } from "@/interface/IEcommerce";

interface IMasterForm {
  id?: number;
  name: string;
  code?: string;
  description: string;
}

interface ICategoryForm {
  id?: number;
  name: string;
  description: string;
  parent_id?: string;
}

export default function ProductMastersPage() {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [showcases, setShowcases] = useState<IProductShowcase[]>([]);
  const [uoms, setUoms] = useState<IUom[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [uomOpen, setUomOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IProductCategory>();
  const [selectedShowcase, setSelectedShowcase] = useState<IProductShowcase>();
  const [selectedUom, setSelectedUom] = useState<IUom>();

  const categoryParentOptions = categories.filter((item) => !item.parent_id);

  const categoryForm = useForm<ICategoryForm>({
    defaultValues: {
      id: undefined,
      name: "",
      description: "",
      parent_id: "",
    },
  });
  const showcaseForm = useForm<IMasterForm>({
    defaultValues: { id: undefined, name: "", description: "" },
  });
  const uomForm = useForm<IMasterForm>({
    defaultValues: { id: undefined, name: "", code: "", description: "" },
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      categoryForm.setValue("id", selectedCategory.id);
      categoryForm.setValue("name", selectedCategory.name);
      categoryForm.setValue("description", selectedCategory.description || "");
      categoryForm.setValue(
        "parent_id",
        selectedCategory.parent_id ? String(selectedCategory.parent_id) : "",
      );
    } else {
      categoryForm.reset();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedShowcase) {
      showcaseForm.setValue("id", selectedShowcase.id);
      showcaseForm.setValue("name", selectedShowcase.name);
      showcaseForm.setValue("description", selectedShowcase.description || "");
    } else {
      showcaseForm.reset();
    }
  }, [selectedShowcase]);

  useEffect(() => {
    if (selectedUom) {
      uomForm.setValue("id", selectedUom.id);
      uomForm.setValue("name", selectedUom.name);
      uomForm.setValue("code", selectedUom.code);
      uomForm.setValue("description", selectedUom.description || "");
    } else {
      uomForm.reset();
    }
  }, [selectedUom]);

  function fetchAll() {
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

  const submitCategory: SubmitHandler<ICategoryForm> = (form) => {
    http
      .post("/product-masters/categories", {
        id: form.id,
        name: form.name,
        description: form.description,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
      })
      .then(({ data }) => {
        notify(data.message);
        setCategoryOpen(false);
        setSelectedCategory(undefined);
        categoryForm.reset();
        fetchAll();
      })
      .catch((err) => notifyError(err));
  };

  const submitShowcase: SubmitHandler<IMasterForm> = (form) => {
    http
      .post("/product-masters/showcases", form)
      .then(({ data }) => {
        notify(data.message);
        setShowcaseOpen(false);
        setSelectedShowcase(undefined);
        showcaseForm.reset();
        fetchAll();
      })
      .catch((err) => notifyError(err));
  };

  const submitUom: SubmitHandler<IMasterForm> = (form) => {
    http
      .post("/product-masters/uoms", form)
      .then(({ data }) => {
        notify(data.message);
        setUomOpen(false);
        setSelectedUom(undefined);
        uomForm.reset();
        fetchAll();
      })
      .catch((err) => notifyError(err));
  };

  function removeCategory(id: number) {
    http
      .delete(`/product-masters/categories/${id}`)
      .then(({ data }) => {
        notify(data.message);
        fetchAll();
      })
      .catch((err) => notifyError(err));
  }

  function removeShowcase(id: number) {
    http
      .delete(`/product-masters/showcases/${id}`)
      .then(({ data }) => {
        notify(data.message);
        fetchAll();
      })
      .catch((err) => notifyError(err));
  }

  function removeUom(id: number) {
    http
      .delete(`/product-masters/uoms/${id}`)
      .then(({ data }) => {
        notify(data.message);
        fetchAll();
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Modal isOpen={categoryOpen} onOpenChange={() => setCategoryOpen(false)}>
        <ModalContent>
          <form onSubmit={categoryForm.handleSubmit(submitCategory)}>
            <ModalHeader>Master Kategori/Subkategori</ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <Controller
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <CustomInput {...field} label="Nama" placeholder="Nama kategori" />
                )}
                rules={{ required: true }}
              />
              <Controller
                control={categoryForm.control}
                name="parent_id"
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    description="Kosongkan jika ingin membuat kategori utama."
                    label="Kategori Induk"
                    selectedKeys={field.value ? [field.value] : []}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {categoryParentOptions.map((item) => (
                      <SelectItem key={String(item.id)}>{item.name}</SelectItem>
                    ))}
                  </CustomSelect>
                )}
              />
              <Controller
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <CustomTextArea {...field} label="Deskripsi" placeholder="Deskripsi" />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setCategoryOpen(false)}>
                Batal
              </Button>
              <Button color="primary" type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={showcaseOpen} onOpenChange={() => setShowcaseOpen(false)}>
        <ModalContent>
          <form onSubmit={showcaseForm.handleSubmit(submitShowcase)}>
            <ModalHeader>Master Etalase</ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <Controller
                control={showcaseForm.control}
                name="name"
                render={({ field }) => (
                  <CustomInput {...field} label="Nama Etalase" placeholder="Etalase A" />
                )}
                rules={{ required: true }}
              />
              <Controller
                control={showcaseForm.control}
                name="description"
                render={({ field }) => (
                  <CustomTextArea {...field} label="Deskripsi" placeholder="Deskripsi" />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setShowcaseOpen(false)}>
                Batal
              </Button>
              <Button color="primary" type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={uomOpen} onOpenChange={() => setUomOpen(false)}>
        <ModalContent>
          <form onSubmit={uomForm.handleSubmit(submitUom)}>
            <ModalHeader>Master UOM</ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <Controller
                control={uomForm.control}
                name="name"
                render={({ field }) => (
                  <CustomInput {...field} label="Nama UOM" placeholder="Piece" />
                )}
                rules={{ required: true }}
              />
              <Controller
                control={uomForm.control}
                name="code"
                render={({ field }) => (
                  <CustomInput {...field} label="Kode UOM" placeholder="pcs" />
                )}
                rules={{ required: true }}
              />
              <Controller
                control={uomForm.control}
                name="description"
                render={({ field }) => (
                  <CustomTextArea {...field} label="Deskripsi" placeholder="Deskripsi" />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setUomOpen(false)}>
                Batal
              </Button>
              <Button color="primary" type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Card>
        <CardHeader className="flex flex-col items-start gap-1">
          <p className="text-lg font-bold">Master Data Produk</p>
          <p className="text-sm text-gray-500">
            Kelola master kategori/subkategori, etalase, dan UOM standar.
          </p>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="masters">
            <Tab key="categories" title="Kategori & Subkategori">
              <div className="mb-3 flex justify-end">
                <Button
                  color="primary"
                  startContent={<PlusCircleIcon size={16} />}
                  onPress={() => {
                    setSelectedCategory(undefined);
                    categoryForm.reset();
                    setCategoryOpen(true);
                  }}
                >
                  Tambah Master Kategori
                </Button>
              </div>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>Nama</TableColumn>
                  <TableColumn>Tipe</TableColumn>
                  <TableColumn>Parent</TableColumn>
                  <TableColumn>Deskripsi</TableColumn>
                  <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody emptyContent={<EmptyContent />}>
                  {categories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.parent_id ? "Subkategori" : "Kategori"}</TableCell>
                      <TableCell>
                        {item.parent_id
                          ? categoryParentOptions.find((e) => e.id === item.parent_id)?.name || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setSelectedCategory(item);
                              setCategoryOpen(true);
                            }}
                          >
                            <EditIcon className="text-warning" size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => confirmSweet(() => removeCategory(item.id))}
                          >
                            <Trash2Icon className="text-danger" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>

            <Tab key="showcases" title="Etalase">
              <div className="mb-3 flex justify-end">
                <Button
                  color="primary"
                  startContent={<PlusCircleIcon size={16} />}
                  onPress={() => {
                    setSelectedShowcase(undefined);
                    showcaseForm.reset();
                    setShowcaseOpen(true);
                  }}
                >
                  Tambah Etalase
                </Button>
              </div>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>Nama</TableColumn>
                  <TableColumn>Deskripsi</TableColumn>
                  <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody emptyContent={<EmptyContent />}>
                  {showcases.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setSelectedShowcase(item);
                              setShowcaseOpen(true);
                            }}
                          >
                            <EditIcon className="text-warning" size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => confirmSweet(() => removeShowcase(item.id))}
                          >
                            <Trash2Icon className="text-danger" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>

            <Tab key="uom" title="UOM">
              <div className="mb-3 flex justify-end">
                <Button
                  color="primary"
                  startContent={<PlusCircleIcon size={16} />}
                  onPress={() => {
                    setSelectedUom(undefined);
                    uomForm.reset();
                    setUomOpen(true);
                  }}
                >
                  Tambah UOM
                </Button>
              </div>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>Nama</TableColumn>
                  <TableColumn>Kode</TableColumn>
                  <TableColumn>Deskripsi</TableColumn>
                  <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody emptyContent={<EmptyContent />}>
                  {uoms.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setSelectedUom(item);
                              setUomOpen(true);
                            }}
                          >
                            <EditIcon className="text-warning" size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => confirmSweet(() => removeUom(item.id))}
                          >
                            <Trash2Icon className="text-danger" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
}
