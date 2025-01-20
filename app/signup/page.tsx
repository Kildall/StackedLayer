import { env } from "@/lib/env";
import { redirect } from "next/navigation";
import { Signup } from "@/components/views/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
};

export default function SignupPage() {
  if (!env.LOGIN_REQUIRED) {
    return redirect("/");
  }

  return <Signup />;
}