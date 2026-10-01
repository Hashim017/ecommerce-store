import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  return <LoginForm />;
}