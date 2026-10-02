import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") redirect("/admin");

  return user ? <Dashboard user={user} /> : <Landing />;
}