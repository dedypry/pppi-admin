import { Image } from "@heroui/react";

import female from "@/assets/images/femenine.png";
import male from "@/assets/images/male.png";

interface Props {
  gender: string;
}
export default function Gender({ gender }: Props) {
  return <Image height={20} src={gender === "male" ? male : female} />;
}
