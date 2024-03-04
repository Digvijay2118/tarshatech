
import { database } from "@/config/db";
import { NextResponse } from "next/server";


export async function POST(request, { params }) {
    try {
        console.log("Deleting support with ID:", params.id);
      await database.query("update support set is_deleted = 1   WHERE id = ?", [params.id]);
    //   console.log("params--->",id)
      return NextResponse.json({}, { status: 204 });
    } catch (error) {
      return NextResponse.json({ message: error.message });
    }
  }


  
export async function GET(request,{params}) {
  try{
      const result = await database.query("select * from support where id = ?",[
          params.id,
      ]);
      console.log("support id =====>",params.id)
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
     
      const updateQuery = "UPDATE support SET ? WHERE id = ?";
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
  
  