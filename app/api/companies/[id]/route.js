import { database } from "@/config/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export async function POST(request, { params }) {
  try {
    console.log("Deleting user with ID:", params.id);
    await database.query("update users set isdeleted = 1   WHERE id = ?", [
      params.id,
    ]);
    //   console.log("params--->",id)
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

export async function GET(request, { params }) {
  try {
    const result = await database.query("select * from users where id   = ?", [
      params.id,
    ]);

    if (result) {
      const user = result;

      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: "users not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();

    console.log("formdata==>", formData);

    const first_name = formData.get("first_name");
    const duration = formData.get("durations");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const active = parseInt(formData.get("active")) || 0;
    const firm_name = formData.get("firm_name");
    const plan_start = formData.get("plans_start");
    const plan_expiry = formData.get("plans_expiry");
    const payment_status = formData.get("payment_status");
    const plans = formData.get("plans");
    const plan_status = formData.get("plan_status");
    const firmLogoFile = formData.get("file");
    // const plans_id = formData.get("plans_id");
    // const updated_at = formData.get("updated_at");
    const firm_logo = firmLogoFile.name;

    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const users = {
      first_name,
      duration,
      email,
    
      username: email,
      password: hashedPassword,
      phone: phone !== "" ? phone : "",
      active,
      department_id: 1,
      post_id: 1,
      firm_name,
      plans,
      plan_start,
      plan_expiry,
      payment_status,
      plan_status,
      firm_logo,
      updated_at: currentDate,
    };

    delete formData.created_at;

    const updateQuery = "UPDATE users SET ? WHERE id = ?";
    await database.query(updateQuery, [users, params.id]);

    if (firmLogoFile) {
      const uploadFolder = path.join(process.cwd(), "public/uploads"); // Adjust the folder path as needed
      const filePath = path.join(uploadFolder, firm_logo);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder);
      }

      const fileBuffer = await firmLogoFile.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));
    }
    return NextResponse.json({
      ...users,
      id: params.id,
    });
  } catch (error) {
    console.error("Error during database update:", error);
    return NextResponse.json({ message: error.message });
  }
}
