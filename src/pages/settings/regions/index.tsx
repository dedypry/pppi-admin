import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import {
  FolderRootIcon,
  SearchIcon,
  ShieldAlert,
  User2Icon,
} from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import DebounceInput from "@/components/forms/debounce-input";
import { useAppDispatch } from "@/stores/hooks";
import {
  getCity,
  getDistrict,
  getProvince,
} from "@/stores/features/area/action";

export default function RegionPage() {
  const [value, setValue] = useState("");
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const province = pathname.endsWith("provinces");
  const city = pathname.endsWith("cities");
  const distric = pathname.endsWith("districts");

  function handleSearch(val: string) {
    setValue(val);

    if (province) {
      dispatch(getProvince({ search: val }));
    } else if (city) {
      dispatch(getCity({ search: val }));
    } else if (distric) {
      dispatch(getDistrict({ search: val }));
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <p>List Area</p>{" "}
        <div className="w-1/3">
          <DebounceInput
            endContent={<SearchIcon className="text-gray-500" />}
            placeholder="Search..."
            value={value}
            onValueChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardBody>
        <Tabs aria-label="Options" selectedKey={pathname}>
          <Tab
            key="/settings/regions/provinces"
            href="/settings/regions/provinces"
            title={
              <div className="flex space-x-2">
                <User2Icon size={20} /> <span>Provinsi</span>
              </div>
            }
          />
          <Tab
            key="/settings/regions/cities"
            href="/settings/regions/cities"
            title={
              <div className="flex space-x-2">
                <FolderRootIcon size={20} /> <span>Kota</span>
              </div>
            }
          />
          <Tab
            key="/settings/regions/districts"
            href="/settings/regions/districts"
            title={
              <div className="flex space-x-2">
                <ShieldAlert size={20} /> <span>Kelurahan</span>
              </div>
            }
          />
        </Tabs>
        <div className="mt-2">
          <Outlet />
        </div>
      </CardBody>
    </Card>
  );
}
