import { database } from "@/config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const query = ` SELECT COUNT(*) AS total_users, COUNT(CASE WHEN plan_status = 2 THEN 1 END) AS users_with_plan_status_2,COUNT(CASE WHEN plan_status = 3 THEN 1 END) AS users_with_plan_status_3   FROM users    WHERE isdeleted = 0;  `;
   const support = `select count(id)as Total_support from support where status = 'Active' and is_deleted = 0`;
    const users = `select count(id) as Total_user   from users  where isdeleted = 0`;

    const result = await database.query(query);
    const supportResult = await database.query(support);
    const usersResult = await database.query(users);


    const responseData = {
      totalUsers: result[0][0].total_users,
      usersWithPlanStatus2: result[0][0].users_with_plan_status_2,
      usersWithPlanStatus3: result[0][0].users_with_plan_status_3,
      totalSupport: supportResult,
      totalUsersInSystem: usersResult,
    };
    
    // console.log("User data -->", responseData);

    return NextResponse.json({ responseData });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}




// import { database } from "@/config/db";
// import { ServerResponse, NextRequest, NextResponse } from "next/server";
// import { Server as SocketIOServer } from "socket.io";
// import { createServer } from "http";

// // Set up HTTP server
// const httpServer = createServer();
// const io = new SocketIOServer(httpServer, {
//   /* add your socket.io options here if needed */
// });

// // Set up Socket.io event listeners
// io.on("connection", (socket) => {
//   console.log("Client connected");
//   // Handle additional socket events as needed
// });

// export async function GET(request) {
//   try {
//     const query = `
//       SELECT COUNT(*) AS total_users, 
//       COUNT(CASE WHEN plan_status = 2 THEN 1 END) AS users_with_plan_status_2,
//       COUNT(CASE WHEN plan_status = 3 THEN 1 END) AS users_with_plan_status_3
//       FROM users
//       WHERE isdeleted = 0;
//     `;
//     const support = `
//       SELECT COUNT(id) AS Total_support
//       FROM support
//       WHERE status = 'Active' AND is_deleted = 0
//     `;
//     const users = `
//       SELECT COUNT(id) AS Total_user
//       FROM users
//       WHERE isdeleted = 0
//     `;

//     const result = await database.query(query);
//     const supportResult = await database.query(support);
//     const usersResult = await database.query(users);

//     const responseData = {
//       totalUsers: result[0][0].total_users,
//       usersWithPlanStatus2: result[0][0].users_with_plan_status_2,
//       usersWithPlanStatus3: result[0][0].users_with_plan_status_3,
//       totalSupport: supportResult,
//       totalUsersInSystem: usersResult,
//     };

//     // Emit the data to connected clients when it's updated
//     io.emit("dashboardDataUpdate", responseData);

//     return NextResponse.json({ responseData });
//   } catch (error) {
//     console.error("GET Error:", error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// // Attach the Next.js API handler to the HTTP server
// httpServer.on("request", (req, res) => {
//   // You can modify this part based on your existing setup
//   NextRequest.on(req, res, { basePath: "" });
// });


// import { database } from "@/config/db";
// import { Server } from "socket.io";

// // Assuming you have already created an HTTP server, replace 'httpServer' with your actual HTTP server instance
// const io = new Server("http://localhost:3000");

// io.on("connection", (socket) => {
//   // Handle the 'getData' event when a client requests data
//   socket.on("getData", async () => {
//     try {
//       const query = `
//         SELECT
//           COUNT(*) AS total_users,
//           COUNT(CASE WHEN plan_status = 2 THEN 1 END) AS users_with_plan_status_2,
//           COUNT(CASE WHEN plan_status = 3 THEN 1 END) AS users_with_plan_status_3
//         FROM users
//         WHERE isdeleted = 0;
//       `;

//       const result = await database.query(query);
//       console.log("User data -->", result);

//       // Emit the result back to the client
//       socket.emit("userData", { result });
//     } catch (error) {
//       console.error("GET Error:", error);
//       // Emit the error message back to the client
//       socket.emit("error", { message: error.message });
//     }
//   });
// });
