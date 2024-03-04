// Update your login.js file
import { database } from "@/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "gojo-satoru";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("login data -->", email, password);

    const [rows] = await database.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    console.log("User data from the database -->", user);

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Invalid Username/Password",
          error: true,
          data: {},
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Compare the entered password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      if (parseInt(user.active) === 1) {
        const token = jwt.sign(
          {
            id: user.id,
            user_roles: user.role,
            role: user.role,
            comp_id: user.comp_id,
          },
          JWT_SECRET,
          { expiresIn: "365d" }
        );

        const data = {
          role: user.role || "",
          user_roles: user.role,
          phone: user.phone || "",
          firm_name:user.firm_name||"",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          fullname: user.fullname || "",
          email: user.email || "",
          firm_name: user.firm_name || "",
          username: user.username || "",
          profile_picture: user.profile_picture || "",
          token: token,
        };

        console.log("data ===> ", data);

        return new Response(
          JSON.stringify({
            message: "Login success",
            error: false,
            data: data,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            message: "Account is Inactive",
            error: true,
            data: {},
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: "Invalid Username/Password",
          error: true,
          data: {},
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.log("err", err);
    return new Response(
      JSON.stringify({ message: "Server error", error: true, data: {} }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
