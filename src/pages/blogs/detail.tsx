import {
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";

import { getColorStatus } from "./helper";
import Comment from "./comments";

import { IBlog } from "@/interface/IBlogs";
import { dateFormat } from "@/utils/helpers/formater";

interface Props {
  blog: IBlog;
  isOpen: boolean;
  setOpen: CallableFunction;
}
export default function BlogDetail({ blog, isOpen, setOpen }: Props) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="bottom-center"
      scrollBehavior="outside"
      size="5xl"
      onOpenChange={() => setOpen(!isOpen)}
    >
      <ModalContent>
        <ModalHeader>Blog Detail</ModalHeader>

        <ModalBody>
          <div className="mb-5 flex flex-col text-center">
            <p className="text-center text-3xl">{blog?.title}</p>
            <p className="font-normal">{blog?.subtitle}</p>
          </div>
          <Image src={blog.cover} />
          <div
            dangerouslySetInnerHTML={{ __html: blog?.content }}
            className="mb-10"
          />
          <p className="italic">
            Di Tulis pada tanggal : {dateFormat(blog?.created_at)}{" "}
          </p>
          <div className="flex items-center gap-5">
            <p className="italic">Status :</p>
            <Chip color={getColorStatus(blog?.status) as any}>
              {blog?.status?.toUpperCase()}
            </Chip>{" "}
          </div>

          {blog && <Comment blog={blog} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
