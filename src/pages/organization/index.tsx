import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { Tree } from "react-organizational-chart";

import CardItemOrg from "./card-item";
import Item from "./item";

import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/config/axios";

export default function OrganizationPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    http
      .get("/organizations")
      .then(({ data }) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => notifyError(err));
  }, []);

  return (
    <Card>
      <CardBody>
        <Tree
          label={<CardItemOrg title="PPPI" />}
          lineBorderRadius="10px"
          lineColor="#15980d"
          lineWidth="1px"
        >
          {data.map((e, i) => (
            <Item key={i} item={e} />
          ))}
        </Tree>
      </CardBody>
    </Card>
  );
}
