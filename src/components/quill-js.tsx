import MagicUrl from "quill-magic-url";
import QuillResizeImage from "quill-resize-image";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import QuillTableUI from "quill-table-ui";

import "quill-table-ui/dist/index.css";
import { uploadFile } from "@/utils/helpers/upload-file";
interface Props {
  value: string;
  onContent: (val: any) => void;
  label?: string;
}
export default function QuillJS({ value, onContent, label }: Props) {
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      table: true,
      tableUI: true,
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["clean"],
        ["blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        ["table"],
      ],
      resize: {
        locale: {},
      },
      magicUrl: true,
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "align",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "clean",
      "blockquote",
      "color",
      "background",
      "table",
      "code-block",
    ],
  });

  if (Quill) {
    Quill.register("modules/resize", QuillResizeImage);
    Quill.register("modules/magicUrl", MagicUrl);
    Quill.register("modules/tableUI", QuillTableUI);
  }

  const insertToEditor = (url: string) => {
    const range = quill!.getSelection();

    quill!.insertEmbed(range!.index, "image", url);
  };

  const saveToServer = async (file: File) => {
    const { url } = await uploadFile(file);

    insertToEditor(url);
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files![0];

      saveToServer(file);
    };
  };

  useEffect(() => {
    if (quill) {
      (quill.getModule("toolbar") as any).addHandler("image", selectLocalImage);

      quill.on("text-change", () => {
        onContent(quill.root.innerHTML);
      });
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill]);

  return (
    <div className="w-full min-h-[400px]">
      {label && <p className="text-sm mb-1">{label}</p>}
      <div ref={quillRef} />
    </div>
  );
}
