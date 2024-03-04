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
  
      const this_data = await request.json();
      console.log("this===>", this_data);

    

       const transcation = {
      user_id:this_data.user_id,
      comp_plans_id:this_data.planId,
      transaction_type:this_data.transaction_type,
      transcation_id:this_data.transcation_id,
      amount:this_data.amount,
      gst:this_data.gst,
      round_off:this_data.round_off, 
      total:this_data.total,
      transcation_status:this_data.transcation_status,
      created_at: getCurrentDateAndTime(),
      created_by:1,
      is_deleted:0,
      updated_at: null,
      updated_by: null,
    };

      console.log("transcation==>", transcation);

      const result = await database.query("INSERT INTO transcation SET ?", [transcation]);

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

