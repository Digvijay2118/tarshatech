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

export async function GET(request) {
  try {
    const result = await database.query(
      "SELECT * FROM mst_plans where is_deleted =0"
    );
    console.log("plans data -->", result);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user_id = request.user ? request.user.id : null;
    const this_data = await request.json();
    console.log("this===>", this_data);

    const plan = {
      status: this_data.active,
      plans_id: this_data.plans,
      user_id: this_data.user_id,
      start_date: this_data.start_date,
      expiry_date: this_data.enddate,
      duration: this_data.duration,
      comp_id: this_data.comp_id,
      gst: this_data.gst,
      // max_admin_allow: this_data.max_admin_allow,
      max_users_allow: this_data.max_user_allow,
      max_customer: this_data.max_customer,
      max_file: this_data.max_file,
      max_upload_size: this_data.max_upload_size,
      price: this_data.netAmount,
      final_price: this_data.finalPrice,
      discount_price: this_data.discount_price,
      created_by: user_id,
      created_at: getCurrentDateAndTime(),
      updated_at: null,
      updated_by: null,
      is_deleted: 0,
    };

    console.log("plan==>", plan);

    const result = await database.query("INSERT INTO company_plans SET ?", [
      plan,
    ]);

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
