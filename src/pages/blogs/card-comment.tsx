import { Accordion, AccordionItem, Avatar, Selection } from "@heroui/react";
import { MessageCircleMoreIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import FormComment from "./form-comment";

import { IComment } from "@/interface/IBlogs";
import { dateFormat } from "@/utils/helpers/formater";
import { confirmSweet } from "@/utils/helpers/confirm";
import { socket } from "@/utils/helpers/socket.io";

interface Props {
  comment: IComment;
}

export default function CardComment({ comment }: Props) {
  const commentKey = String(comment.id);
  const [selectedKey, setSelectedKey] = useState<Selection>(new Set([]));

  const isOpen = selectedKey instanceof Set && selectedKey.has(commentKey);

  return (
    <div>
      <Accordion
        selectedKeys={selectedKey}
        selectionMode="multiple"
        onSelectionChange={setSelectedKey}
      >
        <AccordionItem
          key={commentKey}
          disableIndicatorAnimation
          aria-label={comment.name}
          indicator={
            <div className="flex gap-1">
              <MessageCircleMoreIcon />
              {comment.children.length > 0 && (
                <p className="font-normal text-sm">{comment.children.length}</p>
              )}
              <Trash2Icon
                className="text-danger-300 cursor-pointer"
                onClick={() =>
                  confirmSweet(() =>
                    socket.emit("delete-comment", { id: comment.id }),
                  )
                }
              />
            </div>
          }
          startContent={<Avatar isBordered src={comment?.avatar!} />}
          subtitle={comment.content}
          title={
            <span className="flex flex-col">
              <p className="text-[10px] italic p-0 m-0 text-secondary-600">
                {dateFormat(comment.created_at, "MMMM, DD YYYY | HH:ss WIB")}
              </p>
              <p className="text-md font-semibold p-0 m-0">{comment.name} </p>
            </span>
          }
        >
          <FormComment blogId={comment.blog_id} parentId={comment.id} />
        </AccordionItem>
      </Accordion>

      {comment?.children?.length > 0 && (
        <div className="border-l border-gray-300 pl-2 ml-5">
          {comment.children.map((item) => (
            <CardComment key={item.id} comment={item} />
          ))}
          {!isOpen && (
            <FormComment blogId={comment.blog_id} parentId={comment.id} />
          )}
        </div>
      )}
    </div>
  );
}
