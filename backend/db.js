import { Pool } from 'pg'

const pool = new Pool({
  user: "postgres",
  password: "Postgresql237@.",
  port: 5432,
  database: "vivydb"
})


export default pool;


