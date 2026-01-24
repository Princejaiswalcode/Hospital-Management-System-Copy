import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import admissionRoutes from "./routes/admission.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import salaryRoutes from "./routes/salary.routes.js";
import treatmentRoutes from "./routes/treatment.routes.js";
import wardRoutes from "./routes/ward.routes.js";
import accountsRoutes from "./routes/accounts.routes.js";

import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Hospital Backend Running" });
});

/* =========================
   ROUTES
========================= */

// Auth (NO JWT)
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/dashboard", verifyJWT, dashboardRoutes);
app.use("/api/patients", verifyJWT, patientRoutes);
app.use("/api/doctors", verifyJWT, doctorRoutes);
app.use("/api/appointments", verifyJWT, appointmentRoutes);
app.use("/api/admissions", verifyJWT, admissionRoutes);
app.use("/api/billing", verifyJWT, billingRoutes);
app.use("/api/salary", verifyJWT, salaryRoutes);
app.use("/api/treatments", verifyJWT, treatmentRoutes);
app.use("/api/wards", verifyJWT, wardRoutes);
app.use("/api/accounts", verifyJWT, accountsRoutes);

/* =========================
   EXPORT
========================= */
export { app };
