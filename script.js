document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".pub-card");

    function applyFilter(filter) {
        cards.forEach((card) => {
            const matches = filter === "all" || card.dataset.category === filter;

            // Only the "All" view uses the custom chronological order;
            // individual category tabs keep the original grouped order.
            card.style.order = filter === "all" ? card.dataset.order : "";

            if (matches) {
                card.classList.remove("is-hidden");
            } else {
                card.classList.add("is-hidden");
            }
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;

            filterButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            cards.forEach((card) => {
                const matches = filter === "all" || card.dataset.category === filter;
                if (matches) {
                    card.style.opacity = 0;
                }
            });

            applyFilter(filter);

            requestAnimationFrame(() => {
                cards.forEach((card) => {
                    if (!card.classList.contains("is-hidden")) {
                        card.style.opacity = 1;
                    }
                });
            });
        });
    });

    // Apply the default "All" ordering on first load.
    const initialButton = document.querySelector(".filter-btn.active") || filterButtons[0];
    if (initialButton) {
        applyFilter(initialButton.dataset.filter);
    }

    // Keep the footer's copyright year current automatically.
    const yearEl = document.getElementById("copyright-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
