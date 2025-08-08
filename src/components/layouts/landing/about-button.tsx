import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useState } from "react";

interface Props {
  scrolled: boolean;
}
export default function AboutButton({ scrolled }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DropdownTrigger>
          <p
            className={`link-anim cursor-pointer ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            Tentang Kami
          </p>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key={"about"} color="primary" onClick={() => {}}>
            Sejarah PPPI
          </DropdownItem>
          <DropdownItem key={"visi"} color="primary" onClick={() => {}}>
            Visi dan Misi
          </DropdownItem>
          <DropdownItem key={"struktur"} color="primary" onClick={() => {}}>
            Struktur Organisasi
          </DropdownItem>
          <DropdownItem key={"lpk"} color="primary">
            LPK PPPI
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
