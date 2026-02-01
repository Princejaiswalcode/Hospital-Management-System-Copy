import { apiFetch } from "./api.js";

(async () => {
  const res = await apiFetch("http://localhost:5000/api/appointments/patient");

  const tbody = document.getElementById("appointments");
  res.data.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.status}</td>
    `;
    tbody.appendChild(tr);
  });
})();
