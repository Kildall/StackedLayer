import { Login } from "@/components/views/Login";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  if (!env.LOGIN_REQUIRED) {
    return redirect("/");
  }
  
  return <Login />;
}
