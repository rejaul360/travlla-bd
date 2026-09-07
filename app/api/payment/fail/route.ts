import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const tran_id = formData.get("tran_id") as string;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return NextResponse.redirect(`${baseUrl}/booking?payment_status=failed&tran_id=${tran_id || ""}`, 303);
}