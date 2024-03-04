import { database } from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    console.log("Deleting plans with ID:", params.id);
    await database.query(
      "update company_plans set is_deleted = 1   WHERE id = ?",
      [params.id]
    );
    //   console.log("params--->",id)
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

export async function GET(request, { params }) {
  try {
    const result = await database.query(
      "select * from company_plans where id = ?",
      [params.id]
    );
    const result2 = await database.query(
      "select * from company_plans where is_deleted = 0 and user_id = ?",
      [params.id]
    );
    if (result && result2) {
      const response = {
        user: result,
        plans: result2,
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json({ message: "users not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

export async function PUT(request, { params }) {
  const data = await request.json();

  console.log("data----->", data);
  console.log("params-->", params.id);

  try {
    data.updated_at = new Date();
    delete data.created_at;

    const updateQuery = "UPDATE company_plans SET ? WHERE id = ?";
    // console.log("SQL Query:", updateQuery);

    await database.query(updateQuery, [data, params.id]);

    return NextResponse.json({
      ...data,
      id: params.id,
    });
  } catch (error) {
    console.error("Error during database update:", error);
    return NextResponse.json({ message: error.message });
  }
}
