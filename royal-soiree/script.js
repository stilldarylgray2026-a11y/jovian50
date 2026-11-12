const header = document.querySelector("[data-header]");
const headerSentinel = document.querySelector("[data-header-sentinel]");
const revealItems = document.querySelectorAll(".reveal");
const countdown = document.querySelector("[data-countdown]");
const rsvpSection = document.querySelector("#rsvp");
const rsvpForm = document.querySelector("[data-rsvp-form]");
const attendanceInputs = document.querySelectorAll('input[name="Attendance"]');
const attendingFields = document.querySelector("[data-attending-fields]");
const partyInputs = document.querySelectorAll("[data-party-option]");
const guestField = document.querySelector("[data-guest-field]");
const guestName = document.querySelector("[data-guest-name]");
const submitRsvp = document.querySelector("[data-submit-rsvp]");
const formStatus = document.querySelector("[data-form-status]");
const rsvpSuccess = document.querySelector("[data-rsvp-success]");
const mobileRsvp = document.querySelector("[data-mobile-rsvp]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (header && headerSentinel && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", !entry.isIntersecting);
  });
  headerObserver.observe(headerSentinel);
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const deadline = new Date("2026-11-20T23:59:59-06:00");

const renderCountdown = () => {
  if (!countdown) return;

  const remaining = Math.max(0, deadline.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  countdown.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
  countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");

  if (remaining === 0) {
    countdown.setAttribute("aria-label", "The RSVP deadline has passed");
  }
};

renderCountdown();
setInterval(renderCountdown, 60000);

const setGuestVisibility = () => {
  if (!guestField || !guestName) return;

  const partyChoice = document.querySelector('input[name="Party size"]:checked');
  const hasGuest = partyChoice?.value === "Myself and one guest";

  guestField.hidden = !hasGuest;
  guestName.required = hasGuest;

  if (!hasGuest) guestName.value = "";
};

const setAttendanceVisibility = () => {
  if (!attendingFields) return;

  const attendanceChoice = document.querySelector('input[name="Attendance"]:checked');
  const isAttending = attendanceChoice?.value === "Yes, I will attend";

  attendingFields.hidden = !isAttending;
  partyInputs.forEach((input) => {
    input.required = isAttending;
    if (!isAttending) input.checked = false;
  });

  setGuestVisibility();
};

attendanceInputs.forEach((input) => input.addEventListener("change", setAttendanceVisibility));
partyInputs.forEach((input) => input.addEventListener("change", setGuestVisibility));
setAttendanceVisibility();

if (rsvpForm) {
  rsvpForm.addEventListener("submit", () => {
    if (submitRsvp) {
      submitRsvp.disabled = true;
      submitRsvp.textContent = "Sending RSVP...";
    }

    if (formStatus) formStatus.textContent = "Please wait while your response is sent.";
  });
}

const rsvpWasReceived = new URLSearchParams(window.location.search).get("rsvp") === "received";

if (rsvpWasReceived && rsvpSuccess && rsvpForm) {
  rsvpSuccess.hidden = false;
  rsvpForm.hidden = true;
}

if (rsvpSection && mobileRsvp && "IntersectionObserver" in window) {
  const rsvpObserver = new IntersectionObserver(
    ([entry]) => mobileRsvp.classList.toggle("is-hidden", entry.isIntersecting),
    { threshold: 0.08 }
  );

  rsvpObserver.observe(rsvpSection);
}

if (window.location.hash === "#rsvp" && rsvpSection) {
  window.addEventListener(
    "load",
    () => rsvpSection.scrollIntoView({ block: "start" }),
    { once: true }
  );
}

