import Link from "next/link";
import FormRegister from "./form";

export default function FormComp() {
  return (
    <div className="flex flex-col gap-3">
      <FormRegister />
      <div className="p-4 border border-gray-300 flex justify-center text-[14px]">
        Belum punya akun?{" "}
        <Link href={"/register"} className="ml-2 text-blue-500 font-bold">
          Buat akun
        </Link>
      </div>
    </div>
  );
}
