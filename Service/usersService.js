/**
 * This file contains the service for the users.
 * 
 * Implements the following methods:
 * 
 * * 1. isValidUser: checks if the user exists and if the password matches.
 * * 2. getUsers: gets the list of users.
 * * 3. insertUser: inserts a new user into the database. This method hashes the password before storing it.
 * * 4. changePass: changes the password of a user.This method hashes the password before storing it.   
 * * 5. deleteUser: deletes a user from the database.
 * 
 * About bycrypt: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
 * https://www.youtube.com/watch?v=2qZfnjOIMmA
 * 
 * 02/24/2025
 */
const dataSource = require('../Datasource/MySQLMngr');
const bcrypt = require('bcrypt');

const userQquery = 
`   SELECT 
        u03.username,
        u03.name,
        u03.password ,
        u03.role_id, 
        u02.name as role_name,
        u03.region_id,
        u01.name as region_name
    from u03_users u03 
    join u02_roles u02 on u02.id = u03.role_id
    left join u01_regions u01 on u01.id = u03.region_id 
    where u03.username = ?
`;

const getUsersQuery = 
`   SELECT 
        u03.id as recid,
        u03.username,
        u03.name,
        u03.role_id, 
        u02.name as role_name,
        u03.region_id,
        u01.name as region_name
    from u03_users u03 
    join u02_roles u02 on u02.id = u03.role_id
    left join u01_regions u01 on u01.id = u03.region_id 
`;

const insertAdminQuery = 
`
    INSERT INTO u03_users
    ( username, name, password, role_id)
    VALUES(?, ?,?,?);
`;

const insertUserQuery = 
`
    INSERT INTO u03_users
    ( username, name, password, role_id, region_id)
    VALUES(?,?,?,?,?);
`;

const updatePassQuery = 
`
    update u03_users set password = ? where id = ?
`;

const deleteUserQuery =
`
    DELETE FROM u03_users WHERE id = ?;
`;

/**
 * Given a username and a password, this method searches for the given username on the database.
 * If the given username exists, then uses bcrypt to compare both, the given and the stored hashed password.
 * If both passwords are the same, then returns the User Object to create a Session.
 *  
 * @param {*} username the user's username
 * @param {*} password the provided passowrd
 * @returns a user if autenthication is correct.
 */
async function isValidUser(username, password) {
    try{
        let query = userQquery
        let params = [username];
        qResult = await dataSource.getDataWithParams(query,params);
        let user = qResult.rows[0];
        if(user){
            let isEqual = await bcrypt.compare(password, user.password);
            if(isEqual)
                return user;
        }
        return null;
    }catch(err){
        return null;
    }    
}

/**
 * Method that gets the users list from the database.
 * Doesn't retrieve the stored password.
 * 
 * @returns the users list.
 */
async function getUsers(){
    try{
        let query = getUsersQuery;
        qResult = await dataSource.getData(query);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that stores a new user on the database. 
 * Before inserting the user, hashes the password before storing.
 * @param {*} user 
 * @returns query result object
 */
async function insertUser(user){
    try{
        let query;
        let params;

        let password = await bcrypt.hash(user.password,8)

        if(user.role_id === 1){
            //admin
            query =insertAdminQuery;
            params =[user.username,user.name,password,user.role_id];
        }else{
            //user
            query = insertUserQuery;
            //( username, name, password, role_id, region_id)
            params =[user.username,user.name,password,user.role_id,user.region_id];
        }
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that allows user to modify a password.
 * 
 * @param {*} user given user
 * @param {*} newPass new password
 * @returns query result object
 */
async function changePass(user,newPass){
    try{
        let query = updatePassQuery;
        let password = await bcrypt.hash(newPass,8)
        let params = [password,user];
                
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

/**
 * Method that deletes a given user.
 * 
 * @param {*} user 
 * @returns query result object
 */
async function deleteUser(user){
    try{
        let query = deleteUserQuery;
        let params = [user.id];
        
        qResult = await dataSource.updateData(query,params);
        return qResult;
    }catch(err){
        return new dataSource.QueryResult(false,null,0,0,err);
    }
}

module.exports = {isValidUser,getUsers,insertUser,changePass,deleteUser};