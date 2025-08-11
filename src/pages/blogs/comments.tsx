import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useEffect } from "react";

import FormComment from "./form-comment";
import CardComment from "./card-comment";

import { IBlog } from "@/interface/IBlogs";
import { socket } from "@/utils/helpers/socket.io";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBlogComment } from "@/stores/features/blogs/actions";

interface Props {
  blog: IBlog;
}

export default function Comment({ blog }: Props) {
  const { comments } = useAppSelector((state) => state.blogs);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBlogComment({ id: blog.id }));
    socket.on(`comment-${blog.slug}`, (msg) => {
      if (msg.action === "refresh") {
        dispatch(getBlogComment({ id: blog.id }));
      }
    });

    return () => {
      socket.off("comment");
    };
  }, []);

  return (
    <Card className="mt-5 p-3">
      <CardHeader>
        <p className="text-[20px] font-bold"> {comments.length} Comment</p>
      </CardHeader>
      <CardBody>
        {comments.map((comment) => (
          <CardComment key={comment.id} comment={comment} />
        ))}

        <Divider className="my-5" />

        <CardHeader className="flex flex-col items-start">
          <p className="text-[20px] font-bold">Tinggalkan Comentar</p>
          <p className="text-sm italic text-gray-400">
            Alamat email Anda tidak akan dipublikasikan. Kolom yang wajib diisi
            ditandai dengan tanda
          </p>
        </CardHeader>
        <CardBody>
          <FormComment blogId={blog.id} />
        </CardBody>
      </CardBody>
    </Card>
  );
}
