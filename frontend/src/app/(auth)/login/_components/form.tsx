"use client";

import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

// Validasi form menggunakan Yup
const LoginSchema = yup.object().shape({
  email: yup.string().email("Format email salah").required("email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("password wajib diisi"),
});

interface ILoginForm {
  email: string;
  password: string;
}

export default function FormLogin() {
  const [showPassword, setShowPassword] = useState(false);

  // Initial values untuk form
  const initialValues: ILoginForm = {
    email: "",
    password: "",
  };

  // Fungsi untuk menangani login
  const onLogin = async (
    value: ILoginForm,
    action: FormikHelpers<ILoginForm>
  ) => {
    try {
  
      const { data } = await axios.post("/auth/login", value);
      const user = data.data;

      console.log("Login data:", user);
      await signIn("credentials", {
        redirectTo: "/",
        id: user.id,
        email: user.email,
        password: value.password,  
        name: user.name,
        avatar: user.avatar ?? "", 
        referralCode: user.referralCode ?? "",  
        referralBy: user.referredBy ?? "", 
        role: user.role,  
        accessToken: data.access_token,
      });

  

      toast.success(data.message);
      action.resetForm();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login!");
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onLogin}
      >
        {(props: FormikProps<ILoginForm>) => {
          const { touched, errors, isSubmitting } = props;
          return (
            <Form className="flex min-w-[350px] flex-col border px-10 pb-5 pt-5 border-gray-300">
              <div className="flex justify-center">
                <Image
                  src="/kaos.png"
                  alt="Logo IG"
                  width={150}
                  height={75}
                />
              </div>
              {/* Field untuk email */}
              <Field
                placeholder="Email"
                name="email"
                type="email"
                className="mt-2 mb-1 p-2 border border-gray-300 placeholder:text-[14px] rounded-md shadow-md"
              />
              {touched.email && errors.email ? (
                <div className="text-red-500 text-[12px]">{errors.email}</div>
              ) : null}

              {/* Field untuk password */}
              <div className="relative">
                <Field
                  placeholder="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="mt-2 mb-1 p-2 pr-10 border border-gray-300 placeholder:text-[14px] rounded-md shadow-md w-full"
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
              {touched.password && errors.password ? (
                <div className="text-red-500 text-[12px]">
                  {errors.password}
                </div>
              ) : null}

              {/* Submit button */}
              <button
                className="text-white py-2 px-3 mt-2 rounded-md bg-blue-500 disabled:bg-gray-400 disabled:cursor-none text-sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Masuk"}
              </button>

                  {/* Divider */}
              <div className="flex items-center my-3">
                <div className="flex-grow h-[1px] bg-gray-300" />
                <span className="mx-2 text-sm text-gray-500">atau</span>
                <div className="flex-grow h-[1px] bg-gray-300" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FcGoogle size={20} />
                Login dengan Google
              </button>

            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
