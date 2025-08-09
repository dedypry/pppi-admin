import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  BookPlusIcon,
  SearchIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
  BookCheck,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BlogDetail from "./detail";
import { getColorStatus } from "./helper";

import { confirmSweet } from "@/utils/helpers/confirm";
import { dateFormat } from "@/utils/helpers/formater";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBlogs } from "@/stores/features/blogs/actions";
import { IBlog } from "@/interface/IBlogs";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function BlogPage() {
  const { blogs } = useAppSelector((state) => state.blogs);
  const [data, setData] = useState<IBlog>();
  const [isOpen, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const route = useNavigate();

  useEffect(() => {
    dispatch(getBlogs({}));
  }, []);

  function handleUpdateStatus(
    id: number,
    status: "publish" | "draft" | "rejected" | "submission",
  ) {
    http
      .patch(`/blogs/status/${id}`, { status })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getBlogs({}));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      {data && <BlogDetail blog={data} isOpen={isOpen} setOpen={setOpen} />}
      <Card>
        <CardHeader className="flex justify-between">
          <p>List Blog</p>
          <div>
            <Button
              color="primary"
              size="sm"
              startContent={<BookPlusIcon size={18} />}
              onPress={() => route("/blogs/create")}
            >
              Buat Blog
            </Button>
          </div>
        </CardHeader>
        <CardHeader className="flex justify-end">
          <div>
            <Input
              endContent={<SearchIcon className="text-gray-500" />}
              placeholder="Search"
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Cover</TableColumn>
              <TableColumn>Judul</TableColumn>
              <TableColumn>Kategori</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Views</TableColumn>
              <TableColumn>Penulis</TableColumn>
              <TableColumn>Di Buat</TableColumn>
              <TableColumn>Di Terbitkan</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak Ada Data Blogs">
              {(blogs?.data || []).map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-primary-50"
                  onClick={() => {
                    setData(item);
                    setOpen(!isOpen);
                  }}
                >
                  <TableCell>
                    <img alt="cover" height={50} src={item.cover} />
                  </TableCell>
                  <TableCell>
                    <p>{item.title}</p>
                    <p className="text-xs italic text-gray-600">
                      {item.subtitle}
                    </p>
                  </TableCell>
                  <TableCell>{item.category?.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={getColorStatus(item.status) as any}
                      variant="dot"
                    >
                      {item.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{item.view_count}</TableCell>
                  <TableCell>{item.writer?.name}</TableCell>
                  <TableCell>{dateFormat(item.created_at)}</TableCell>
                  <TableCell>{dateFormat(item.publish_at)}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <EllipsisVerticalIcon />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="reject"
                          color="danger"
                          startContent={<LogOutIcon size={18} />}
                          onPress={() =>
                            confirmSweet(
                              () => handleUpdateStatus(item.id, "rejected"),
                              {
                                confirmButtonText: "Ya, Reject",
                              },
                            )
                          }
                        >
                          Tolak
                        </DropdownItem>
                        <DropdownItem
                          key="publish"
                          color="success"
                          startContent={<BookCheck size={18} />}
                          onPress={() => handleUpdateStatus(item.id, "publish")}
                        >
                          Terbitkan
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          color="warning"
                          startContent={<EditIcon size={18} />}
                          onClick={() => route(`/blogs/${item.id}/edit`)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          color="danger"
                          startContent={<Trash2Icon size={18} />}
                          onPress={() => confirmSweet(() => {})}
                        >
                          Hapus
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        {blogs && (
          <CardFooter className="flex justify-center">
            <Pagination
              isCompact
              showControls
              initialPage={blogs?.current_page}
              radius="full"
              total={blogs?.last_page}
              onChange={(page) =>
                dispatch(
                  getBlogs({
                    page,
                  }),
                )
              }
            />
          </CardFooter>
        )}
      </Card>
    </>
  );
}
