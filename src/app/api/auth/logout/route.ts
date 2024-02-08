"use server";
import { signOut } from "@/auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    await signOut({
      redirectTo: "/auth/login",
    });
    return NextResponse.json({ message: "user logged out!" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to log out" }, { status: 500 });
  }
}
