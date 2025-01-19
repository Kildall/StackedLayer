import { Login } from "@/components/views/Login";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";

export default function LoginPage() {
  if (!env.LOGIN_REQUIRED) {
    return redirect("/");
  }
  
  return <Login />;
}
