const header = document.querySelector("[data-header]");
const headerSentinel = document.querySelector("[data-header-sentinel]");
const revealItems = document.querySelectorAll(".reveal");
const countdown = document.querySelector("[data-countdown]");
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

