document.addEventListener("DOMContentLoaded", () => {
  const clinicHourDetails = Array.from(
    document.querySelectorAll(".contact-clinic-hours")
  );

  if (!clinicHourDetails.length) return;

  clinicHourDetails.forEach((detailsEl) => {
    detailsEl.addEventListener("toggle", () => {
      if (!detailsEl.open) return;

      clinicHourDetails.forEach((otherEl) => {
        if (otherEl !== detailsEl) {
          otherEl.open = false;
        }
      });
    });
  });
});
