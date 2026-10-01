import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    loggedIn: !!user,
    role: user?.role ?? null,
  });
}