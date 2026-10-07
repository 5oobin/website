document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("grid");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    const photos = (typeof PHOTOS_DATA !== "undefined") ? PHOTOS_DATA : [];

    if (photos.length === 0) {
        grid.innerHTML = '<div class="empty-state">Photos coming soon.</div>';
    } else {
        photos.forEach(function (photo) {
            const item = document.createElement("div");
            item.className = "grid-item";
            item.dataset.category = photo.category;

            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.alt || "";
            img.loading = "lazy";
            img.draggable = false;

            item.appendChild(img);
            grid.appendChild(item);
        });
    }

    // Disable right-click / context menu on images (soft protection against easy saving).
    grid.addEventListener("contextmenu", function (e) {
        if (e.target.tagName === "IMG") {
            e.preventDefault();
        }
    });
    lightboxImg.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Tab filtering
    const items = () => document.querySelectorAll(".grid-item");

    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;
            tabButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            items().forEach(function (item) {
                const matches = filter === "all" || item.dataset.category === filter;
                item.classList.toggle("is-hidden", !matches);
            });
        });
    });

    // Lightbox open/close
    let currentIndex = -1;

    function visiblePhotos() {
        return Array.from(items()).filter((item) => !item.classList.contains("is-hidden"));
    }

    function openLightboxAt(index) {
        const visible = visiblePhotos();
        if (index < 0 || index >= visible.length) return;
        currentIndex = index;
        const img = visible[index].querySelector("img");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        currentIndex = -1;
    }

    grid.addEventListener("click", function (e) {
        if (e.target.tagName !== "IMG") return;
        const visible = visiblePhotos();
        const clickedItem = e.target.closest(".grid-item");
        const index = visible.indexOf(clickedItem);
        openLightboxAt(index);
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            openLightboxAt(currentIndex + 1);
        } else if (e.key === "ArrowLeft") {
            openLightboxAt(currentIndex - 1);
        }
    });
});
