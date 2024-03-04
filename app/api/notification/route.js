import { database } from "@/config/db";
import { NextResponse } from "next/server";


function getCurrentDateAndTime() {
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace("T", " ");
  return formattedDateTime;
}

export async function GET(request) {
    try {
    
  
      const result = await database.query("SELECT * FROM tarsha_notification");
    
  
   
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
      console.log("this===>", this_data);

      const notification = {
      
        title: this_data.title,
        send_to: this_data.send_to,
        description: this_data.description,
        created_by: user_id,
        created_at: getCurrentDateAndTime(),
        updated_at: null,
        updated_by: null,

      };

      console.log("notification==>", notification);

      const result = await database.query("INSERT INTO tarsha_notification SET ?", [notification]);

      const data = {
        error: false,
        message: "notification has been added successfully.",
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

