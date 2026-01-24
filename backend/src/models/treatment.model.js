import {db} from '../db/index.js';

export const findUserByUsername=async(username)=>{
    const query=`SELECT user_id, username, password, role, full_name
    FROM users
    WHERE username=?`;
    const [rows]=await db.execute(query,[username]);
    return rows;
};

export const findUserByUserId=async(user_id)=>{
    const query=`SELECT user_id, username, password, role, full_name
    FROM users
    WHERE user_id=?`;
    const [rows]=await db.execute(query,[user_id]);
    return rows;
};