import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;
    const amount = formData.get("amount") as string;
    const card_type = formData.get("card_type") as string;
    const bank_tran_id = formData.get("bank_tran_id") as string;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // ওয়ার্ডপ্রেস ব্যাকএন্ডে অর্ডার স্ট্যাটাস 'Paid' হিসেবে আপডেট করার কল এখানে যুক্ত হবে

    // সফল হলে ইউজারকে ফ্রন্টএন্ডের সুন্দর সাকসেস পেজে রিডাইরেক্ট করুন
    return NextResponse.redirect(
      `${baseUrl}/booking/success?tran_id=${tran_id}&amount=${amount}&method=${encodeURIComponent(card_type || "Online")}&bank_tran_id=${bank_tran_id || ""}`,
      303
    );
  } catch (err) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/booking?error=payment_failed`, 303);
  }
}