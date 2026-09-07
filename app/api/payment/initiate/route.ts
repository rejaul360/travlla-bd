// app/api/payment/initiate/route.ts
import { NextResponse } from "next/server";
// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";

const store_id = process.env.SSLCOMMERZ_STORE_ID || "testbox";
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, destination, travelers, packageType, totalAmount, notes } = body;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const tran_id = `TRV_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${baseUrl}/api/payment/success?tran_id=${tran_id}`,
      fail_url: `${baseUrl}/api/payment/fail?tran_id=${tran_id}`,
      cancel_url: `${baseUrl}/api/payment/cancel?tran_id=${tran_id}`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: "NO",
      product_name: `ট্যুর বুকিং: ${destination}`,
      product_category: "Travel",
      product_profile: "travel-tickets",
      cus_name: name || "Customer Name",
      cus_email: email || "customer@example.com",
      cus_add1: "Dhaka, Bangladesh",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: phone || "01700000000",
      value_a: destination,
      value_b: String(travelers),
      value_c: packageType,
      value_d: notes || "",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({ url: apiResponse.GatewayPageURL, tran_id });
    } else {
      return NextResponse.json(
        { message: "পেমেন্ট গেটওয়ে লোড করা যায়নি।" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("SSLCommerz Init Error:", error);
    return NextResponse.json(
      { message: error?.message || "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}