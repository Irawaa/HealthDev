import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { LoginForm } from "@/components/login-form";
import { LoadingDialog } from "@/components/loading-dialog";
import { toast, Toaster } from "react-hot-toast";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("loading"); // ✅ Track success/error state
  const { data, setData, post, errors } = useForm({
    username: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("loading");


    post("/login", {
      onSuccess: () => {
        toast.success("Login successful! Redirecting...");
        setStatus("success"); // ✅ Change to success state

        // ✅ Delay hiding the loader AFTER animation plays (2s), THEN redirect
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            router.visit("/dashboard");
          }, 1000); // ✅ Small delay for UI transition before redirect
        }, 2000); // ✅ Let success animation play for 2s
      },
      onError: () => {
        toast.error(errors.username || "Invalid credentials, please try again.");
        setStatus("error"); // ✅ Show red X mark

        setTimeout(() => {
          setLoading(false); // ✅ Hide dialog after showing error
        }, 2000); // ✅ Let error animation play before hiding
      },
    });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-10">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-3">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              onSubmit={handleSubmit}
              loading={loading}
              data={data}
              setData={setData}
              errors={errors}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block lg:col-span-7">
        <img
          src="images/pnc-bg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <LoadingDialog isOpen={loading} status={status} />
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
