import db from '../db/index.js';

export const createPatient=async(first_name,last_name,age,gender,contact_number,address,status)=>{
    const query=`INSERT INTO patients 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [rows]=await db.execute(query,[first_name,last_name,age,gender,contact_number,address,status]);
    return rows;
}

export const listPatient=async()=>{
    const query=`SELECT * FROM patients`;

    const [rows]=await db.execute(query);
    return rows;
}

export const updatePatient=async(patient_id,first_name,last_name,contact_number,address,status)=>{
    const query=`UPDATE patients 
    SET first_name=?,
    last_name=?,
    contact_number=?,
    address=?,
    status=?
    WHERE patient_id=?`;

    const [result]=await db.execute(query,[first_name,last_name,contact_number,address,status,patient_id]);
    return result;
}