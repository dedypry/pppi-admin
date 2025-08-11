import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";

import QuillJS from "@/components/forms/quill-js";
import { http } from "@/config/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppSelector } from "@/stores/hooks";

export default function BioForm() {
  const { user } = useAppSelector((state) => state.user);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  function handleUpdate() {
    setLoading(true);
    http
      .patch("/profile/bio", { bio })
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (user) {
      setBio(user.bio);
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>Bio</CardHeader>
      <CardBody>
        <QuillJS value={bio} onContent={setBio} />
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button
          color="primary"
          isLoading={loading}
          variant="shadow"
          onPress={handleUpdate}
        >
          Simpan
        </Button>
      </CardFooter>
    </Card>
  );
}
