import { useEffect, useState } from "react";

import ContentLeft from "./content-left";
import ContentRight from "./content-right";

import { useAppDispatch } from "@/stores/hooks";
import { getApps } from "@/stores/features/apps/action";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export interface IProps {
  isLoading?: boolean;
  setLoading: (val: boolean) => void;
  onSubmit: (data: any) => void;
}

export default function AppsPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getApps());
  }, []);

  function onSubmit(data: any) {
    setLoading(true);
    http
      .patch("/apps/apps", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getApps());
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <ContentLeft
          isLoading={loading}
          setLoading={setLoading}
          onSubmit={onSubmit}
        />
      </div>
      <div className="col-span-8">
        <ContentRight
          isLoading={loading}
          setLoading={setLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
