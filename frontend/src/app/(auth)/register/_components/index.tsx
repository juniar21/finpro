import Link from "next/link";
import FormRegister from "./form";

export default function FormComp() {
  return (
    <div className="flex flex-col gap-3">
      <FormRegister />
      <div className="p-4 border border-gray-300 flex justify-center text-[14px]">
        Punya akun?{" "}
        <Link href={"/login"} className="ml-2 text-blue-500 font-bold">
          Masuk
        </Link>
      </div>
    </div>
  );
}
