document.addEventListener("DOMContentLoaded", () => {
  checkRoleAccess();
  loadUserInfo();
  setupFormActions();
  loadBills();
  setupLogout();
});

/* ROLE CHECK */
function checkRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user || !["Admin", "Accounts"].includes(user.role)) {
    showToast("error", "Access denied");
    window.location.href = "dashboard.html";
  }
}

/* USER INFO */
function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  userName.innerText = user.name;
  headerUserName.innerText = user.name;
  userRole.innerText = user.role + " Dashboard";
  userAvatar.innerText = user.name.charAt(0).toUpperCase();
}

/* FORM TOGGLE + TOTAL CALC */
function setupFormActions() {
  const form = document.getElementById("billFormCard");

  toggleBillForm.onclick = () => {
    form.classList.toggle("hidden");
  };

  cancelBillBtn.onclick = () => {
    form.classList.add("hidden");
  };

  [consultationCharge, medicineCharge, roomCharge].forEach(i =>
    i.addEventListener("input", updateTotal)
  );

  generateBillBtn.onclick = createBill;
}

function updateTotal() {
  const total =
    Number(consultationCharge.value) +
    Number(medicineCharge.value) +
    Number(roomCharge.value);

  totalAmount.innerText = `₹${total.toFixed(2)}`;
}

/* LOAD BILLS */
function loadBills() {
  fetch("http://localhost:5000/api/billing")
    .then(res => res.json())
    .then(data => {
      billingTable.innerHTML = "";

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
        billingTable.appendChild(tr);
      });
    });
}

/* CREATE BILL */
function createBill() {
  const payload = {
    patient_id: patientSelect.value,
    consultation: consultationCharge.value,
    medicine: medicineCharge.value,
    room: roomCharge.value
  };

  fetch("http://localhost:5000/api/billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      showToast("success", "Bill generated");
      billFormCard.classList.add("hidden");
      loadBills();
    })
    .catch(() => showToast("error", "Failed to generate bill"));
}

/* MARK PAID */
function markPaid(id) {
  fetch(`http://localhost:5000/api/billing/${id}/pay`, {
    method: "PUT"
  })
    .then(() => {
      showToast("success", "Payment updated");
      loadBills();
    });
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  };
}
