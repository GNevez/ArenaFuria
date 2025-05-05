import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "g4motocenter.com.br",
  user: "g4motocenter_furia",
  password: process.env.DB_PASSWORD,
  database: "g4motocenter_furia",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
