import mysql from "mysql2/promise";

export const database = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  port: 3306,
  password: "Vcare123???",
  database: "tarsha",
});
