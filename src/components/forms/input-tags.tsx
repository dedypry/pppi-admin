import { Chip, InputProps } from "@heroui/react";
import { XIcon } from "lucide-react";
import { useState } from "react";

import CustomInput from "./custom-input";

interface Props {
  onTags: CallableFunction;
  items: string[];
}
export default function InputTags({
  onTags,
  items,
  ...props
}: Props & InputProps) {
  const [tags, setTags] = useState("");

  function handleTags(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tags.trim();

      if (trimmed && !items.includes(trimmed)) {
        onTags([...items, tags]);
        setTags("");
      }
    }
  }

  function handleRemoveTag(tag: string) {
    const updated = items.filter((item) => item !== tag);

    onTags(updated);
  }

  return (
    <div>
      <CustomInput
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        onKeyDown={handleTags}
        {...props}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip
            key={item}
            as="div"
            color="primary"
            endContent={
              <XIcon
                className="mx-1 cursor-pointer text-white"
                size={15}
                onClick={() => handleRemoveTag(item)}
              />
            }
            size="sm"
          >
            {item}
          </Chip>
        ))}
      </div>
    </div>
  );
}
