/* HERU BALI TOUR website — business contact configured from client-provided details. */
const SITE_CONFIG = {
  whatsappNumber: "6282322589437", // Client-provided WhatsApp: 0823 2258 9437
  businessName: "HERU BALI TOUR"
};

const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".car-card")];
const count = document.getElementById("fleetCount");
const toast = document.getElementById("toast");
const modal = document.getElementById("bookingModal");
const carSelect = document.getElementById("carSelect");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    let visible = 0;
    cards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = String(visible).padStart(2, "0");
  });
});

function openModal(carName = "") {
  if (carName) carSelect.value = carName;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => modal.querySelector("input[name='name']").focus(), 40);
}
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => openModal()));
document.querySelectorAll("[data-car]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.car)));
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("show")) closeModal(); });

document.getElementById("bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const car = String(form.get("car") || "");
  const date = String(form.get("date") || "");
  const service = String(form.get("service") || "");
  const notes = String(form.get("notes") || "").trim();
  if (!name || !car || !date) return;

  if (!/^62\d{8,15}$/.test(SITE_CONFIG.whatsappNumber)) {
    closeModal();
    showToast("Nomor WhatsApp belum dapat digunakan. Silakan hubungi Heru Bali Tour secara langsung.");
    return;
  }

  const message = [
    `Halo ${SITE_CONFIG.businessName}, saya ingin menanyakan pemesanan rental mobil.`,
    "",
    `Nama: ${name}`,
    `Kendaraan: ${car}`,
    `Tanggal mulai: ${date}`,
    `Jenis layanan: ${service}`,
    `Catatan: ${notes || "-"}`
  ].join("\n");
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  closeModal();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
