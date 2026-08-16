(function () {
  const btn = document.querySelector(".navtoggle");
  const nav = document.querySelector(".nav-left");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const modal = document.getElementById("contactModal");
  document.querySelectorAll("[data-open-form]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (!modal) return;
      modal.classList.add("open");
    });
  });
  modal?.querySelector("[data-close-form]")?.addEventListener("click", () => modal.classList.remove("open"));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  const form = document.getElementById("intakeForm");
  if (!form) return;
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const fd = new FormData(form);
    const looking = [...form.querySelectorAll("input[name=looking]:checked")].map((i) => i.value);
    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      dueDate: String(fd.get("dueDate") || "").trim(),
      provider: String(fd.get("provider") || "").trim(),
      placeOfDelivery: String(fd.get("placeOfDelivery") || "").trim(),
      about: String(fd.get("about") || "").trim(),
      lookingFor: looking,
      source: "website",
    };
    if (!payload.firstName || !(payload.email || payload.phone)) {
      msg.textContent = "Please leave a first name and an email or phone.";
      return;
    }
    const site = (window.CASCADE && window.CASCADE.convexSite) || "";
    if (!site) {
      msg.textContent = "Form is wired. Convex is not linked on this preview yet, so this did not send. Nicole will get these once the Convex project is created.";
      form.reset();
      return;
    }
    try {
      const r = await fetch(site.replace(/\/$/, "") + "/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || "Could not send");
      msg.textContent = "Thank you for reaching out. I will be in touch soon.";
      form.reset();
    } catch (err) {
      msg.textContent = err.message || "Something went wrong. Email cascadedoulanl@gmail.com.";
    }
  });
})();
