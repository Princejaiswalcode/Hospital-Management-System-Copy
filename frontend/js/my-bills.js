import { apiFetch } from "./api.js";

(async () => {
  const res = await apiFetch("http://localhost:5000/api/billing/patient");

  const tbody = document.getElementById("bills");
  res.data.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${b.bill_id}</td>
      <td>₹${b.total_amount}</td>
      <td>${b.payment_status}</td>
      <td>${b.bill_date}</td>
    `;
    tbody.appendChild(tr);
  });
})();
