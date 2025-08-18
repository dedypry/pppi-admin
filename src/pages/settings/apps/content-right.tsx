import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { useState } from "react";

import FormPersonal from "./tabs/form-personal";
import VisiMisi from "./tabs/visi-misi";
import History from "./tabs/history";

import { IProps } from ".";

export default function ContentRight(props: IProps) {
  const [selected, setSelected] = useState("form-personal");

  const Content = (type: string) => {
    let result = <FormPersonal {...props} />;

    switch (type) {
      case "visi-misi":
        result = <VisiMisi {...props} />;
        break;
      case "history":
        result = <History {...props} />;
        break;

      default:
        break;
    }

    return result;
  };

  return (
    <form action="">
      <Card>
        <CardHeader>
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as any)}
          >
            <Tab key="form-personal" title="Form Personal" />
            <Tab key="visi-misi" title="Visi Misi" />
            <Tab key="history" title="Sejarah PPPI" />
          </Tabs>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">{Content(selected)}</CardBody>
      </Card>
    </form>
  );
}
