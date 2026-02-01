import { apiFetch } from "./api.js";

(async () => {
  const res = await apiFetch("http://localhost:5000/api/treatments/patient");

  const container = document.getElementById("treatments");
  res.data.forEach(t => {
    const div = document.createElement("div");
    div.className = "treatment-card";
    div.innerHTML = `
      <h4>${t.diagnosis}</h4>
      <p><b>Doctor:</b> ${t.doctor}</p>
      <p><b>Date:</b> ${t.date}</p>
      <p><b>Prescription:</b> ${t.prescription}</p>
    `;
    container.appendChild(div);
  });
})();
