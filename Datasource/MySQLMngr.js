/**
 * MySQLManager contains methods to interact with a MySQL database.
 * Reuses typical SQL operations such as get, insert, update, and bulk insert.
 * 
 * In order to manage properly the connection pool, it uses the mysql2/promise library.
 * Creates a connection pool that can be reused across multiple requests.
 * 
 * On each method, it gets a connection from the pool, executes the query, and releases the connection back to the pool.
 * When required (for inserts and updates), it uses transactions to ensure data integrity.
 * 
 * Handles connections with async/await syntax for better readability and error handling.
 * 
 * This effort comes after investigating the best practices for Node.js and MySQL interactions and mysql transactions and
 * race conditions.
 * 
 * Secure Code!
 * 
 * Ernesto Cantú
 * 05/26/2025
 *  
 * @module MySQLManager
 * @requires mysql2/promise
 */
const mysql = require('mysql2/promise')
require('dotenv').config()

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const USR = process.env.USR;
const PASS = process.env.PASS;
const DB = process.env.DB;

let pool = mysql.createPool({
  host: HOST,//constants.dbHost,
  user: USR,//The OS has a env variable called USER, causing an error on DB login.
  port: PORT,//constants.dbPort,
  password: PASS,//constants.dbPass,
  database: DB,//constants.dbName,
  decimalNumbers:true,
  waitForConnections: true,
  connectionLimit: 10,
});;

/**
 * Class that responds with an object of the result of a database interaction.
 */
class QueryResult{

  constructor(status,rows, gen_id, changes ,err){
      this.status = status;
      this.rows = rows;
      this.gen_id = gen_id;
      this.changes = changes;
      this.err = err;
  }

  getStatus = () => { return this.status;}
  getRows = () => { return this.rows;}
  getGenId = () => { return this.gen_id;}
  getChanges = () => { return this.changes;}
  getErr = () => { return this.err;}
}


/**
 * Method that extracts Data without params from a database.
 * 
 * @param {String} query the query to extract data
 * @returns A Query Result object
 */
async function getData(query){
  try{
    console.log("Get Data");
    let conn = await pool.getConnection();
    const [data,fields] = await conn.query(query);
    conn.release();
    return new QueryResult(true,data,0,0,'');
  }catch(error){
    console.log(error);
    return new QueryResult(false,null,0,0,error);
  }
}


/**
 * This method executes a query with params
 * Perfect for search queries.
 * 
 * @param {String} query the search query
 * @param {Array} params array of params
 * @returns {Object} An object of the class QueryResult
 */
async function getDataWithParams(query,params){
  try{
      console.log("GetData");
      const conn = await pool.getConnection();
      const [data,fields] = await conn.query(query,params);
      conn.release();
      return new QueryResult(true,data,0,0,'');
  }catch(error){
    console.log(error);
    return new QueryResult(false,null,0,0,error);
  }
}

/**
 * Makes an insert of an object on the Database.
 * 
 * @param {String} query The insert query that will be executed
 * @param {Array} params the params for the insert
 * @returns {Object} An object of the class QueryResult
 */
async function insertData(query,params){
  let conn;
  try{
      console.log("Insert Data");
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [data,fields] = await conn.query(query,params);
      await conn.commit();
      return new QueryResult(true,data,data.insertId,data.affectedRows,'')
  }catch(error){
    console.log(error);
    if(conn)
      await conn.rollback();
    return new QueryResult(false,null,0,0,error); 
  } finally {
    if (conn) 
      conn.release();
  }
}

/**
 * Bulk insert method for inserting multiple rows on a database table.
 * 
 * @param {String} query The insert query that will be executed
 * @param {Array} params the params for the insert
 * @returns {Object} An object of the class QueryResult
 */
async function bulkInsertData(query,elements){
  let conn;
  try{
      console.log("BULK Insert Data");
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [data,fields] = await conn.query(query,[elements]);
      await conn.release();
      conn.commit();  
      return new QueryResult(true,data,data.insertId,data.affectedRows,'');
  } catch(error){
    console.log(error);
    if(conn)  
      conn.rollback();
    return new QueryResult(false,null,0,0,error); 
  } finally {
    if (conn)
      conn.release();
  }
}

/**
 * Method that executes a query update on the database.
 * It can be an update or delete.
 * 
 * @param {String} query the update query
 * @param {*} params the array of params
 * @returns a Query Result Object
 */
async function updateData(query,params){
  let conn;
  try{
      console.log("Update Data");
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const [data,fields] = await conn.query(query,params);
      await conn.commit();
      return new QueryResult(true,data,0,data.affectedRows,'');
  }catch(error){
    console.log(error);
    if(conn) 
      await conn.rollback();
    return new QueryResult(false,null,0,0,error); 
  } finally{
    if(conn) conn.release();
  }
}



  module.exports = {QueryResult,getData,getDataWithParams,insertData,bulkInsertData,updateData}