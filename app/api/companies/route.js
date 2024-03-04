import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { database } from "@/config/db";

export async function POST(request) {
  try {
    // Use request.formData() instead of request.json()
    const formData = await request.formData();

    console.log("formdata====>", formData);
    // Access fields in formData using get()
    const first_name = formData.get("first_name");
    // const last_name = formData.get("last_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const active = parseInt(formData.get("active")) || 0;
    const firm_name = formData.get("firm_name");
    const duration = formData.get("duration");
    const plan_start = formData.get("plan_start_date");
    const plan_expiry = formData.get("plans_end_date");
    const payment_status = formData.get("payment_status");
    const plans = formData.get("plans");
    const plan_status = formData.get("plan_status");
    const firmLogoFile = formData.get("file");
    const firm_logo = firmLogoFile.name;
    const selectplan = formData.get("selectedPlan");

    console.log("firm_logo==>", firm_logo);

    // plans Data
    const selectplanData = JSON.parse(selectplan);

    console.log("selectplanData==>", selectplanData);
    const plans_id = selectplanData.id;
    // const support_text = selectplanData.support_text;
    // const start_dates = selectplanData.start_date;
    // const expiry_dates = selectplanData.expiry_date;
    const gst = selectplanData.gst;
    // const max_admin_allow = selectplanData.max_admin_allow;
    const max_users_allow = selectplanData.max_user_allow;
    const max_customer = selectplanData.max_customer;
    const max_file = selectplanData.max_file;
    const max_upload_size = selectplanData.max_upload_size;
    const price_per_month = selectplanData.price_per_month;
    const final_price = selectplanData.sell_price_per_month;
    // const price_per_year = selectplanData.price_per_year;
    // const sell_price_year = selectplanData.sell_price_year;
    const status = selectplanData.status;

    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    // const start_date = start_dates.replace("T", " ").slice(0, -5);
    // const expiry_date = expiry_dates.replace("T", " ").slice(0, -5);
    // Insert into the 'company' table
    const company = {
      plans_id: plans_id,
      logo: firm_logo,
      team_members: max_users_allow,
      // no_of_admins: max_admin_allow,
      name: firm_name,
      created_at: currentDate,
      created_by: 1,
      is_deleted: 0,
    };
    console.log("company===>", company);
    const companyResult = await database.query(
      "INSERT INTO `company` SET ?",
      company
    );

    const companyId = companyResult[0].insertId;

    

    const users = {
      first_name,
      duration,
      comp_id: companyId,
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
    };

    console.log("users--->", users);

    const result = await database.query("INSERT INTO `users` SET ?", users);

    const userId = result[0].insertId;

    console.log("userId===>", userId);

    const usergroup = {
      mst_user_id: userId,
      mst_group_id: 1,
    };

    const user = await database.query(
      "INSERT INTO `users_groups` SET ?",
      usergroup
    );

    const plansData = {
      user_id: userId,
      comp_id: companyId,
      plans_id,
      start_date: plan_start,
      expiry_date: plan_expiry,
      gst,
      duration,
      max_users_allow,
      max_customer,
      max_file,
      max_upload_size,
      price: price_per_month,
      final_price,
      status,
      created_at: currentDate,
      is_deleted: 0,
    };

    const plan = await database.query(
      "INSERT INTO `company_plans` SET ?",
      plansData
    );

    console.log("plan==>", plan);

    if (firmLogoFile) {
      const uploadFolder = path.join(process.cwd(), "public/uploads"); // Adjust the folder path as needed
      const filePath = path.join(uploadFolder, firm_logo);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder);
      }

      const fileBuffer = await firmLogoFile.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));
    }

    // Assuming the insertion was successful, you can return a success response
    return new NextResponse(200, {
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error parsing FormData", err);

    // If there's an error parsing FormData, return an appropriate error response
    return new NextResponse(400, { success: false, message: "Bad Request" });
  }
}

export async function GET(request) {
  try {
    const result = await database.query(
      "SELECT * FROM users where isdeleted = 0 AND firm_name IS NOT NULL"
    );
    // console.log("User data -->", result);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
