import { Card, CardBody, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <Card className="max-w-md w-full shadow-xl border-none">
        <CardBody className="flex flex-col items-center text-center gap-6 p-8">
          <div className="text-6xl">🚧</div>
          <h1 className="text-3xl font-bold text-gray-800">Coming Soon</h1>
          <p className="text-gray-600">
            Halaman ini sedang dalam pengembangan. Nantikan update terbaru dari
            kami.
          </p>
          <Button
            color="primary"
            radius="full"
            size="lg"
            onPress={() => navigate("/")}
          >
            Kembali ke Beranda
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
