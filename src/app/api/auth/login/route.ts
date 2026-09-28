import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vst.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vst@2026";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check against environment / default credentials
    const matchesDefault =
      (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() || cleanEmail === "admin") &&
      cleanPassword === DEFAULT_ADMIN_PASSWORD;

    let isAuthenticated = matchesDefault;

    // 2. Check if a custom password was saved in Supabase bot_settings
    if (!isAuthenticated) {
      try {
        const { data } = await supabase
          .from("bot_settings")
          .select("custom_admin_password, custom_admin_email")
          .eq("id", "default")
          .maybeSingle();

        if (data && data.custom_admin_password) {
          const dbEmail = data.custom_admin_email || DEFAULT_ADMIN_EMAIL;
          if (
            (cleanEmail === dbEmail.toLowerCase() || cleanEmail === "admin") &&
            cleanPassword === data.custom_admin_password
          ) {
            isAuthenticated = true;
          }
        }
      } catch (err) {
        console.error("Supabase auth check error:", err);
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Success response with session token
    const token = `vst_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      token,
      user: {
        name: "VST Super Admin",
        email: cleanEmail,
        role: "owner",
        loginTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
