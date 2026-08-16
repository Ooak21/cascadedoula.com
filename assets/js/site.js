(function () {
  const panel = document.getElementById("navPanel");
  const burger = document.querySelector(".burger");
  function open() {
    panel?.classList.add("open");
    burger?.setAttribute("aria-expanded", "true");
    burger?.setAttribute("aria-label", "Close menu");
  }
  function close() {
    panel?.classList.remove("open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Open menu");
  }
  function toggle(e) {
    e.stopPropagation();
    panel?.classList.contains("open") ? close() : open();
  }
  burger?.addEventListener("click", toggle);
  panel?.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
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
      msg.textContent = "Form is wired. Convex is not linked on this preview yet, so this did not send.";
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
