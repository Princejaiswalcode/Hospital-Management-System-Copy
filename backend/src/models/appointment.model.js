import db from '../db/index.js'

export const createAppointment=async(patient_id,doctor_id,appointment_date,appointment_time,appointment_type,status)=>{
    const query=`INSERT INTO appointments
        (patient_id,doctor_id,appointment_date,appointment_time,appointment_type,status)
        VALUES (?, ?, ?, ?, ?, ?)`;

    const [rows]=await db.execute(query,[patient_id,doctor_id,appointment_date,appointment_time,appointment_type,status]);
    return rows.InsertId;
}

export const getTodaysAppointments=async(appointment_date,appointment_month)=>{
    const query=`SELECT 
        a.appointment_id,
        p.first_name AS patient_name,
        d.first_name AS doctor_name,
        a.appointment_time,
        a.appointment_type,
        a.status
        FROM appointments a
        JOIN patients p ON a.patient_id=p.patient_id
        JOIN doctors d ON a.doctor_id=d.doctor_id
        WHERE day(a.appointment_date)=? and month(a.appointment_date)=?`;

    const [result]=await db.execute(query,[appointment_date,appointment_month]);
    return result;
}

export const updateAppointmentStatus=async(appointment_id,status)=>{
    const query=`UPDATE appointments 
    SET status=?
    WHERE appointment_id=?`;

    const [rows]=await db.execute(query,[status,appointment_id]);
    return rows;
}