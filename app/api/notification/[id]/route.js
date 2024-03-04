
import { database } from "@/config/db";
import { NextResponse } from "next/server";




  
export async function GET(request,{params}) {
  try{
      const result = await database.query("select * from tarsha_notification where id = ?",[
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
    const data = await request.json();

    console.log("data----->",data)
    console.log("params-->",params.id)
  
    try {
    
      data.updated_at = new Date();
      delete data.created_at;
     
      const updateQuery = "UPDATE tarsha_notification SET ? WHERE id = ?";
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
  