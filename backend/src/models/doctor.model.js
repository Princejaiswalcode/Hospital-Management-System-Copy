import { db } from '../db/index.js';

export const createDoctor=async(first_name,last_name,specialization,phone_number,email)=>{
    const query=`INSERT INTO doctors
        (first_name, last_name, specialization, phone_number, email)
        VALUES (?, ?, ?, ?, ?)`;
    
    const doctor=await db.execute(query,[first_name,last_name,specialization,phone_number,email]);
    return doctor;
}

export const getDoctorList=async()=>{
    const query=`SELECT * FROM doctors`;

    const [result]=await db.execute(query);
    return result;
}

export const getDoctorByUserId = async (user_id) => {
  const [[row]] = await db.execute(
    "SELECT doctor_id FROM doctors WHERE user_id = ?",
    [user_id]
  );
  return row;
};
