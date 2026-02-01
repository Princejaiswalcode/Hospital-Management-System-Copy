import { apiFetch } from "./api.js";

(async () => {
  const res = await apiFetch("http://localhost:5000/api/patients/me");

  const p = res.data;
  document.getElementById("name").innerText = p.full_name;
  document.getElementById("age").innerText = p.age;
  document.getElementById("gender").innerText = p.gender;
  document.getElementById("phone").innerText = p.phone;
  document.getElementById("email").innerText = p.email;
  document.getElementById("status").innerText = p.current_status;
})();
