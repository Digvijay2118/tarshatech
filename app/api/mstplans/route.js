import { database } from "@/config/db";
import { NextResponse } from "next/server";

function getCurrentDateAndTime() {
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return formattedDateTime;
}

export async function POST(request) {
  try {
    const user_id = request.user ? request.user.id : null;
    const this_data = await request.json();
    console.log("this===>", this_data);

    const plan = {
      status: this_data.active,
      title: this_data.title,
      support_text: this_data.support_text,
      gst: this_data.gst,
      // max_admin_allow: this_data.max_admin_allow,
      max_user_allow: this_data.max_user_allow,
      max_customer: this_data.max_customer,
      max_file: this_data.max_file,
      // start_date: this_data.plan_start_date,
      // expiry_date:this_data.plan_expiry_date,
      max_upload_size: this_data.max_upload_size,
      price_per_month: this_data.price_per_month,
      sell_price_per_month: this_data.sell_price_month,
      price_per_year: this_data.price_per_year,
      sell_price_year: this_data.sell_price_year,
      created_by: user_id,
      created_at: getCurrentDateAndTime(),
      updated_at: null,
      updated_by: null,
      is_deleted: 0,
    };

    console.log("plan==>", plan);

    const result = await database.query("INSERT INTO mst_plans SET ?", [plan]);

    const data = {
      error: false,
      message: "Plan has been added successfully.",
      data: {
        id: result.insertId,
      },
    };

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: true, message: error.message, data: {} },
      { status: 500 }
    );
  }
}
