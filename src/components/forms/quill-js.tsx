import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  i18nChangeLanguage,
} from "@wangeditor/editor";
import { useEffect, useState } from "react";

import { uploadFile } from "@/utils/helpers/upload-file";

i18nChangeLanguage("en");
interface Props {
  value: string;
  onContent: (val: any) => void;
  label?: string;
  isInvalid?: boolean;
}
export default function QuillJS({ value, onContent, isInvalid, label }: Props) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(value);

  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ["fullScreen"],
  };

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "Tulis konten di sini...",
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: (url: string) => void) {
          const { url } = await uploadFile(file, "content");

          insertFn(url);
        },
      },
    },
  };

  useEffect(() => {
    setHtml(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  const content = (
    <div
      className={`w-full min-h-[400px] border ${isInvalid ? "border-danger" : "border-secondary-200"} `}
    >
      {/* {label && (
          <p className={`text-sm mb-1 ${isInvalid ? "text-red-500" : ""}`}>
            {label}
          </p>
        )} */}
      <Toolbar defaultConfig={toolbarConfig} editor={editor} mode="default" />
      <Editor
        defaultConfig={editorConfig}
        mode="default"
        style={{ height: "400px", overflowY: "auto" }}
        value={html}
        onChange={(editor: any) => {
          setHtml(editor.getHtml());
          onContent(editor.getHtml());
        }}
        onCreated={setEditor}
      />
    </div>
  );

  return (
    <div>
      {label && (
        <p
          className={`text-gray-600 text-sm py-2 ${isInvalid ? "text-danger" : ""} `}
        >
          {label}
        </p>
      )}
      {content}
    </div>
  );
}
