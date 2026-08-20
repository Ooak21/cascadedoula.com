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
  // How long the form was on screen before it was sent. A person filling six
  // fields and a paragraph cannot beat three seconds. A script always does.
  const openedAt = Date.now();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const fd = new FormData(form);
    const looking = [...form.querySelectorAll("input[name=looking]:checked")].map((i) => i.value);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      dueDate: String(fd.get("dueDate") || "").trim(),
      provider: String(fd.get("provider") || "").trim(),
      placeOfDelivery: String(fd.get("placeOfDelivery") || "").trim(),
      about: String(fd.get("about") || "").trim(),
      lookingFor: looking,
      source: "website",
      hp: String(fd.get("website2") || ""),
      elapsedMs: Date.now() - openedAt,
      first_name: firstName,
      last_name: lastName,
      edd: String(fd.get("dueDate") || "").trim(),
      birth_place: String(fd.get("placeOfDelivery") || "").trim(),
      message: String(fd.get("about") || "").trim(),
      interests: looking,
    };
    if (!firstName || !(email || phone)) {
      msg.textContent = "Please leave a first name and an email or phone.";
      return;
    }
    const site = (window.CASCADE && window.CASCADE.convexSite) || "";
    if (!site) {
      msg.textContent = "The form is not connected yet. Email cascadedoulanl@gmail.com.";
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
