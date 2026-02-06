document.addEventListener("DOMContentLoaded", () => {
  checkRoleAccess();
  loadUserInfo();
  setupFormActions();
  loadBills();
  setupLogout();
});

/* =========================
   ROLE CHECK
========================= */
function checkRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !["admin", "accounts"].includes(user.role)) {
    showToast("error", "Access denied");
    window.location.href = "/frontend/html/dashboard.html";
  }
}

/* =========================
   USER INFO
========================= */
function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  document.getElementById("userName").innerText = user.full_name;
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userRole").innerText =
    `${user.role.toUpperCase()} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();
}

/* =========================
   FORM ACTIONS
========================= */
function setupFormActions() {
  const formCard = document.getElementById("billFormCard");
  const toggleBtn = document.getElementById("toggleBillForm");
  const cancelBtn = document.getElementById("cancelBillBtn");
  const generateBtn = document.getElementById("generateBillBtn");

  const consultation = document.getElementById("consultationCharge");
  const medicine = document.getElementById("medicineCharge");
  const room = document.getElementById("roomCharge");

  toggleBtn.onclick = () => {
    formCard.classList.toggle("hidden");
  };

  cancelBtn.onclick = () => {
    formCard.classList.add("hidden");
  };

  [consultation, medicine, room].forEach(input =>
    input.addEventListener("input", updateTotal)
  );

  generateBtn.onclick = createBill;
}

/* =========================
   TOTAL CALC
========================= */
function updateTotal() {
  const consultation = Number(document.getElementById("consultationCharge").value);
  const medicine = Number(document.getElementById("medicineCharge").value);
  const room = Number(document.getElementById("roomCharge").value);

  const total = consultation + medicine + room;
  document.getElementById("totalAmount").innerText = `₹${total.toFixed(2)}`;
}

/* =========================
   LOAD BILLS
========================= */
function loadBills() {
  const token = sessionStorage.getItem("token");

  fetch("http://localhost:5000/api/billing", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("billingTable");
      table.innerHTML = "";

      data.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>#${b.patient_id}</td>
          <td><strong>${b.patient_name}</strong></td>
          <td>₹${b.consultation}</td>
          <td>₹${b.medicine}</td>
          <td>₹${b.room}</td>
          <td><strong>₹${b.total}</strong></td>
          <td>${b.date}</td>
          <td>
            <span class="badge ${b.status.toLowerCase()}">${b.status}</span>
          </td>
          <td>
            ${
              b.status === "Pending"
                ? `<a href="#" onclick="markPaid(${b.id})">Mark as Paid</a>`
                : "-"
            }
          </td>
        `;
        table.appendChild(tr);
      });
    })
    .catch(() => showToast("error", "Failed to load bills"));
}

/* =========================
   CREATE BILL
========================= */
function createBill() {
  const token = sessionStorage.getItem("token");

  const payload = {
    patient_id: document.getElementById("patientSelect").value,
    consultation: document.getElementById("consultationCharge").value,
    medicine: document.getElementById("medicineCharge").value,
    room: document.getElementById("roomCharge").value
  };

  fetch("http://localhost:5000/api/billing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      showToast("success", "Bill generated");
      document.getElementById("billFormCard").classList.add("hidden");
      loadBills();
    })
    .catch(() => showToast("error", "Failed to generate bill"));
}

/* =========================
   MARK PAID
========================= */
function markPaid(id) {
  const token = sessionStorage.getItem("token");

  fetch(`http://localhost:5000/api/billing/${id}/pay`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      showToast("success", "Payment updated");
      loadBills();
    });
}

/* =========================
   LOGOUT
========================= */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
