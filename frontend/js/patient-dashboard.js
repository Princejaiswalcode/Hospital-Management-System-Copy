import { apiFetch } from "./api.js";

(async () => {
  try {
    const stats = await apiFetch("http://localhost:5000/api/dashboard/patient");

    document.getElementById("upcomingCount").innerText = stats.data.upcomingAppointments;
    document.getElementById("treatmentCount").innerText = stats.data.totalTreatments;
    document.getElementById("pendingBills").innerText = `₹${stats.data.pendingBills}`;

    fill("upcomingAppointments", stats.data.appointments, a =>
      `${a.doctor} – ${a.date} ${a.time}`
    );

    fill("recentTreatments", stats.data.treatments, t =>
      `${t.diagnosis} – ${t.date}`
    );

  } catch (e) {
    console.error(e);
  }
})();

function fill(id, items, formatter) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = formatter(i);
    ul.appendChild(li);
  });
}
