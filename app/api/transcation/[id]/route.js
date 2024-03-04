import { database } from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    console.log("Deleting user with ID:", params.id);
    await database.query(
      "update transcation set is_deleted = 1   WHERE id = ?",
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
      "select * from transcation where is_deleted = 0 and id   = ?",
      [params.id]
    );

    const result3 = await database.query(
      "select * from transcation where is_deleted = 0 and user_id   = ?",
      [params.id]
    );

    if (result && result3) {
      const response = {
        user: result,

        transcation: result3,
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

    const updateQueryTranscation = "UPDATE transcation SET ? WHERE id = ?";

    await database.query(updateQueryTranscation, [data, params.id]);

    return NextResponse.json({
      ...data,
      id: params.id,
    });
  } catch (error) {
    console.error("Error during database update:", error);
    return NextResponse.json({ message: error.message });
  }
}
// export async function PUT(request, { params }) {
//   const data = await request.json();

//   console.log("data ----->", data);

//   try {
//     // Extract user-related data
//     const userUpdateData = {
//       comp_id: data.comp_id,
//       firm_name: data.firm_name,
//       first_name: data.first_name,
//       last_name: data.last_name,
//       email: data.email,
//       password:data.password,
//       username:data.username,
//       phone: data.phone,
//       active:  data.active,
//       firm_logo: data.firm_logo,
//       plans:data.plans,
//       plan_start: data.plan_start,
//       plan_expiry:  data.plan_expiry,
//       payment_status: data.payment_status,
//       plan_status:  data.plan_status,

//     };

//     // Extract transaction-related data
//     const transcationUpdateData = {
//       transaction_type: data.transaction_type,
//       transcation_id: data.transcation_id,
//       amount: data.amount,
//       gst: data.gst,
//       round_off: data.round_off,
//       total: data.total,
//       transcation_status: data.transcation_status,
//       updated_by:1,
//     };

//     userUpdateData.updated_at = new Date();
//     delete userUpdateData.created_at;
//     transcationUpdateData.updated_at = new Date();
//     delete transcationUpdateData.created_at;

//     const updateUserQuery = "UPDATE users SET ? WHERE id = ?";
//     const updateTranscationQuery = "UPDATE transcation SET ? WHERE user_id = ?";

//     // Update users table
//     await database.query(updateUserQuery, [userUpdateData, params.id]);

//     // Update transcation table
//     await database.query(updateTranscationQuery, [transcationUpdateData, params.id]);

//     return NextResponse.json({
//       ...userUpdateData,
//       id: params.id,
//     });
//   } catch (error) {
//     console.error("Error during database update:", error);
//     return NextResponse.json({ message: error.message });
//   }
// }
