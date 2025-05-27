"use client";

import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

const RegisterSchema = yup.object().shape({
  email: yup.string().email("Format email salah").required("email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("password wajib diisi"),
  name: yup.string().required("username wajib diisi"),
  role: yup
    .string()
    .oneOf(["CUSTOMER", "ADMIN", "SUPER_ADMIN"], "Invalid role")
    .required("Role wajib dipilih"),
});

interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function FormRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: IRegisterForm = {
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  };

  const onRegister = async (
    value: IRegisterForm,
    action: FormikHelpers<IRegisterForm>
  ) => {
    try {
      const { data } = await axios.post("/auth", value);
      toast.success(data.message);
      action.resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mendaftar");
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={onRegister}
      >
        {(props: FormikProps<IRegisterForm>) => {
          const { touched, errors, isSubmitting } = props;
          return (
            <Form className="flex min-w-[350px] flex-col border px-10 pb-5 pt-5 border-gray-300 rounded-md shadow-md bg-white">
              <div className="flex justify-center mb-4">
                <Image src="/kaos.png" alt="Logo" width={150} height={75} />
              </div>

              <Field
                placeholder="Email"
                name="email"
                type="email"
                className="mt-2 mb-1 p-2 border border-gray-300 placeholder:text-[14px] rounded-md shadow-sm"
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-[12px]">{errors.email}</div>
              )}

              <div className="relative">
                <Field
                  placeholder="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="mt-2 mb-1 p-2 pr-10 border border-gray-300 placeholder:text-[14px] rounded-md shadow-sm w-full"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="text-red-500 text-[12px]">
                  {errors.password}
                </div>
              )}

              <Field
                placeholder="Nama"
                name="name"
                type="text"
                className="mt-2 mb-1 p-2 border border-gray-300 placeholder:text-[14px] rounded-md shadow-sm"
              />
              {touched.name && errors.name && (
                <div className="text-red-500 text-[12px]">{errors.name}</div>
              )}

              <Field
                as="select"
                name="role"
                className="mt-2 mb-1 p-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </Field>
              {touched.role && errors.role && (
                <div className="text-red-500 text-[12px]">{errors.role}</div>
              )}

              <button
                className="text-white py-2 px-3 mt-2 rounded-md bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Daftar Manual"}
              </button>

              {/* Divider */}
              <div className="my-3 text-center text-gray-500 text-sm">atau</div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={() => signIn("google")}
                className="bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600"
              >
                Daftar / Login dengan Google
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
