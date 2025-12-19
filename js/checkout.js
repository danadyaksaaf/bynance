// Checkout page logic: populate summary, compute next payment, handle form submit + modal
document.addEventListener("DOMContentLoaded", () => {
  // Parse URL parameters for plan details
  const params = new URLSearchParams(window.location.search);
  const planName = params.get("plan");
  const planPrice = params.get("price");
  const planPeriod = params.get("period");

  const elPlanName = document.getElementById("plan-name");
  const elPlanPrice = document.getElementById("plan-price");
  const elPlanPeriod = document.getElementById("plan-period");
  const elNextDeadline = document.getElementById("next-payment-deadline");

  //   Summary modal and form elements
  const form = document.getElementById("checkout-form");
  const summaryModal = document.getElementById("summary-modal");
  const successModal = document.getElementById("success-modal");
  const cancelButton = document.getElementById("cancel-summary");
  const confirmButton = document.getElementById("confirm-checkout");
  const summaryPlan = document.getElementById("summary-plan");
  const summaryPrice = document.getElementById("summary-price");
  const summaryDate = document.getElementById("summary-date");
  const summaryName = document.getElementById("summary-name");
  const summaryEmail = document.getElementById("summary-email");
  const summaryCard = document.getElementById("summary-card");
  const summaryAddress = document.getElementById("summary-address");

  if (elPlanName) {
    elPlanName.textContent = planName ? planName : "Professional";
  }
  if (elPlanPrice) {
    elPlanPrice.textContent = planPrice ? "$" + planPrice : "$749";
  }
  if (elPlanPeriod) {
    elPlanPeriod.textContent = planPeriod ? "/" + planPeriod : "/month";
  }

  // Set default date to next month
  if (elNextDeadline) {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    // Format date for input type="date" (YYYY-MM-DD)
    const year = next.getFullYear();
    const month = String(next.getMonth() + 1).padStart(2, "0");
    const day = String(next.getDate()).padStart(2, "0");
    elNextDeadline.value = `${year}-${month}-${day}`;
  }

  // Set default and minimum for card expiry month picker (YYYY-MM)
  const elExpiry = document.getElementById("expiry");
  if (elExpiry) {
    const defaultExpiry = new Date();
    defaultExpiry.setMonth(defaultExpiry.getMonth() + 1);
    const ey = defaultExpiry.getFullYear();
    const em = String(defaultExpiry.getMonth() + 1).padStart(2, "0");
    elExpiry.value = `${ey}-${em}`;

    const minExpiry = new Date();
    const my = minExpiry.getFullYear();
    const mm = String(minExpiry.getMonth() + 1).padStart(2, "0");
    elExpiry.min = `${my}-${mm}`;
  }

  // Helper function to mask card number
  function maskCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length >= 4) {
      return "**** **** **** " + cleaned.slice(-4);
    }
    return cardNumber;
  }

  // Helper function to format date for display
  function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Show summary modal with form data
  function showSummaryModal() {
    const formData = new FormData(form);

    // Populate summary modal
    if (summaryPlan) summaryPlan.textContent = elPlanName.textContent;
    if (summaryPrice)
      summaryPrice.textContent =
        elPlanPrice.textContent + " " + elPlanPeriod.textContent;
    if (summaryDate)
      summaryDate.textContent = formatDateForDisplay(
        formData.get("nextPaymentDeadline")
      );
    if (summaryName) summaryName.textContent = formData.get("fullName") || "—";
    if (summaryEmail) summaryEmail.textContent = formData.get("email") || "—";
    if (summaryCard)
      summaryCard.textContent = maskCardNumber(
        formData.get("cardNumber") || "—"
      );
    if (summaryAddress) summaryAddress.textContent = formData.get("address") || '—';

    // Show summary modal
    summaryModal.setAttribute("aria-hidden", "false");
    summaryModal.classList.add("show");
  }

  // Hide summary modal
  function hideSummaryModal() {
    summaryModal.classList.remove("show");
    summaryModal.setAttribute("aria-hidden", "true");
  }

  // Show success modal
  function showSuccessModal() {
    successModal.setAttribute("aria-hidden", "false");
    successModal.classList.add("show");

    // After a short delay hide it and redirect to home
    setTimeout(() => {
      successModal.classList.remove("show");
      successModal.setAttribute("aria-hidden", "true");
      // Redirect to home page
      window.location.href = "../index.html";
    }, 2200);
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      // Basic validation: ensure required inputs are filled (browser already handles but double-check)
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Show summary modal for confirmation
      showSummaryModal();
    });
  }

  // Handle cancel button
  if (cancelButton) {
    cancelButton.addEventListener("click", hideSummaryModal);
  }

  // Handle confirm button
  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      hideSummaryModal();
      setTimeout(showSuccessModal, 300); // Small delay for better UX
    });
  }

  // --- Address autocomplete, map and geolocation (OpenStreetMap + Leaflet) ---
  const addressInput = document.getElementById("address");
  const suggestionsEl = document.getElementById("address-suggestions");
  const useLocationBtn = document.getElementById("use-location");
  const latInput = document.getElementById("address-lat");
  const lonInput = document.getElementById("address-lon");
  const mapEl = document.getElementById("map");

  let map = null;
  let marker = null;

  function initMap() {
    if (!mapEl || typeof L === "undefined") return;
    map = L.map("map", { scrollWheelZoom: false }).setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
  }

  function setMarker(lat, lon, label) {
    if (!map) return;
    if (!marker) {
      marker = L.marker([lat, lon], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        reverseGeocode(p.lat, p.lng);
      });
    } else {
      marker.setLatLng([lat, lon]);
    }
    map.setView([lat, lon], 15);
    if (latInput) latInput.value = lat;
    if (lonInput) lonInput.value = lon;
    if (label && addressInput) addressInput.value = label;
  }

  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        if (addressInput) addressInput.value = data.display_name;
        if (latInput) latInput.value = lat;
        if (lonInput) lonInput.value = lon;
      }
    } catch (err) {
      console.warn("Reverse geocode failed", err);
    }
  }

  // Simple debounce helper
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  async function searchAddresses(query) {
    if (!query || query.length < 3) return [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=6`;
      const res = await fetch(url);
      const list = await res.json();
      return list;
    } catch (err) {
      console.warn("Address search failed", err);
      return [];
    }
  }

  function renderSuggestions(items) {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.style.padding = "8px";
      li.style.cursor = "pointer";
      li.textContent = it.display_name;
      li.dataset.lat = it.lat;
      li.dataset.lon = it.lon;
      li.addEventListener("click", () => {
        if (addressInput) addressInput.value = it.display_name;
        if (latInput) latInput.value = it.lat;
        if (lonInput) lonInput.value = it.lon;
        renderSuggestions([]);
        setMarker(parseFloat(it.lat), parseFloat(it.lon), it.display_name);
      });
      suggestionsEl.appendChild(li);
    });
  }

  const doSearch = debounce(async () => {
    const q = addressInput && addressInput.value;
    const res = await searchAddresses(q);
    renderSuggestions(res || []);
  }, 300);

  if (addressInput) {
    addressInput.addEventListener("input", doSearch);
    addressInput.addEventListener("focus", doSearch);
  }

  if (useLocationBtn) {
    useLocationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      useLocationBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setMarker(lat, lon);
          reverseGeocode(lat, lon);
          useLocationBtn.disabled = false;
        },
        (err) => {
          console.warn(err);
          alert("Unable to retrieve your location.");
          useLocationBtn.disabled = false;
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    });
  }

  // Initialize the map after DOM ready
  initMap();

  // Close summary modal when clicking outside
  if (summaryModal) {
    summaryModal.addEventListener("click", (ev) => {
      if (ev.target === summaryModal) {
        hideSummaryModal();
      }
    });
  }
});
