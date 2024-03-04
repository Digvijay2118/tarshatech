import { database } from "@/config/db";
import { NextResponse } from "next/server";


function getCurrentDateAndTime() {
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace("T", " ");
  return formattedDateTime;
}

export async function GET(request) {
    try {
    
  
      const result = await database.query("SELECT * FROM support where is_deleted = 0");
    
  
   
      return NextResponse.json({ result });
    } catch (error) {
      console.error("GET Error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }


  export async function POST(request){
    try {
      const user_id = request.user ? request.user.id : null;
      const this_data = await request.json();
      // console.log("requesr==>",request)
      console.log("this===>", this_data);

      const support = {
        name:this_data.name,
        email: this_data.email,
        firm_name:this_data.firm_name,
        subject: this_data.subject,
        priority: this_data.priority,
        message: this_data.message,
        status:this_data.status,
        created_by: user_id,
        created_at: getCurrentDateAndTime(),
        updated_at: null,
        updated_by: null,
        is_deleted: 0,
      };

    //   console.log("plan==>", support.title);

      const result = await database.query("INSERT INTO support SET ?", [support]);

      const data = {
        error: false,
        message: "support request  successfully.",
        data: {
          id: result.insertId,
        },
      };

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error("POST Error:", error);
      return NextResponse.json({ error: true, message: error.message, data: {} }, { status: 500 });
    }
  }

