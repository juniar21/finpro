"use client";

import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import { signIn } from "next-auth/react";

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
  const initialValues: ILoginForm = {
    email: "",
    password: "",
  };

  const onLogin = async (
    value: ILoginForm,
    action: FormikHelpers<ILoginForm>
  ) => {
    try {
      const data = await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirectTo: "/",
      });
      action.resetForm();
      console.log(data);
    } catch (err) {
      console.log(err);
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
              <Field
                placeholder="Email"
                name="email"
                type="email"
                className="mt-2 mb-1 p-2 border border-gray-300 placeholder:text-[14px] rounded-md shadow-md"
              />
              {touched.email && errors.email ? (
                <div className="text-red-500 text-[12px]">{errors.email}</div>
              ) : null}

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

              <button
                className=" text-white py-2 px-3 mt-2 rounded-md bg-blue-500 disabled:bg-gray-400 disabled:cursor-none text-sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading" : "Masuk"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
