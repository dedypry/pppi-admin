import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function ErrorNotFoundPage() {
  const route = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg mt-2">Halaman yang kamu cari tidak ditemukan</p>

      <Button color="primary" onPress={() => route("/")}>
        Kembali ke Beranda
      </Button>
    </div>
  );
}
