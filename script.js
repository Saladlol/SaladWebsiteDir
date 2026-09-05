// scroll reveal

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    observer.observe(element);
});


// gallery elements

const galleryItems = document.querySelectorAll(".gallery-item");


// hover to play videos

galleryItems.forEach((item) => {
    const video = item.querySelector("video");

    if (!video) return;

    item.addEventListener("mouseenter", () => {
        video.play();
    });

    item.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
    });
});


// lightbox elements

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxClose = document.getElementById("lightboxClose");

const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");


// photo set state

let currentSetImages = [];
let currentSetIndex = 0;


// open gallery items

galleryItems.forEach((item) => {
    item.addEventListener("click", () => {

        const type = item.dataset.type;

        lightboxContent.innerHTML = "";
        lightboxDescription.textContent = item.dataset.description || "";

        // photo set

        if (type === "photo-set") {

            currentSetImages = JSON.parse(item.dataset.images);
            currentSetIndex = 0;

            lightboxPrev.style.display = "block";
            lightboxNext.style.display = "block";
            lightboxCounter.style.display = "block";

            showSetImage();
        }


        // video

        else if (type === "video") {

            currentSetImages = [];
            currentSetIndex = 0;

            lightboxPrev.style.display = "none";
            lightboxNext.style.display = "none";
            lightboxCounter.style.display = "none";


            const video = document.createElement("video");

            video.src = item.dataset.src;

            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.playsInline = true;

            lightboxContent.appendChild(video);
        }


        // normal image

        else {

            currentSetImages = [];
            currentSetIndex = 0;

            lightboxPrev.style.display = "none";
            lightboxNext.style.display = "none";
            lightboxCounter.style.display = "none";


            const image = document.createElement("img");

            image.src = item.dataset.src;
            image.alt = item.dataset.title;

            lightboxContent.appendChild(image);
        }


        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";
    });
});


// show photo set image

function showSetImage() {

    lightboxContent.innerHTML = "";


    const image = document.createElement("img");

    image.src = currentSetImages[currentSetIndex];
    image.alt = "Portfolio image";

    lightboxContent.appendChild(image);


    lightboxCounter.textContent =
        `${currentSetIndex + 1} / ${currentSetImages.length}`;
}


// close lightbox

function closeLightbox() {

    lightbox.classList.remove("active");

    lightboxContent.innerHTML = "";
    lightboxDescription.textContent = "";

    currentSetImages = [];
    currentSetIndex = 0;

    lightboxPrev.style.display = "none";
    lightboxNext.style.display = "none";
    lightboxCounter.style.display = "none";

    document.body.style.overflow = "";
}


// close button

lightboxClose.addEventListener("click", closeLightbox);


// click outside media to close

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


// photo set previous image

lightboxPrev.addEventListener("click", (event) => {

    event.stopPropagation();

    if (currentSetImages.length === 0) {
        return;
    }

    currentSetIndex--;

    if (currentSetIndex < 0) {
        currentSetIndex = currentSetImages.length - 1;
    }

    showSetImage();
});


// photo set next image

lightboxNext.addEventListener("click", (event) => {

    event.stopPropagation();

    if (currentSetImages.length === 0) {
        return;
    }

    currentSetIndex++;

    if (currentSetIndex >= currentSetImages.length) {
        currentSetIndex = 0;
    }

    showSetImage();
});


// keyboard controls

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }


    // escape closes the lightbox

    if (event.key === "Escape") {
        closeLightbox();
        return;
    }


    // left arrow goes to the previous image

    if (event.key === "ArrowLeft") {

        if (currentSetImages.length === 0) {
            return;
        }

        lightboxPrev.click();
    }


    // right arrow goes to the next image

    if (event.key === "ArrowRight") {

        if (currentSetImages.length === 0) {
            return;
        }

        lightboxNext.click();
    }

});


// photo set hover slideshow

const photoSets = document.querySelectorAll(".photo-set");

photoSets.forEach((set) => {

    const images = JSON.parse(set.dataset.images);
    const preview = set.querySelector(".set-preview img");

    let currentImage = 0;
    let slideshow;


    // preload photo set images

    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });


    // mouse enter

    set.addEventListener("mouseenter", () => {

        if (images.length <= 1) {
            return;
        }

        slideshow = setInterval(() => {

            currentImage++;

            if (currentImage >= images.length) {
                currentImage = 0;
            }

            preview.style.opacity = "0";

            setTimeout(() => {

                preview.src = images[currentImage];

                preview.style.opacity = "1";

            }, 250);

        }, 1800);

    });


    // mouse leave

    set.addEventListener("mouseleave", () => {

        clearInterval(slideshow);

        currentImage = 0;

        preview.style.opacity = "0";

        setTimeout(() => {

            preview.src = images[0];

            preview.style.opacity = "1";

        }, 250);

    });

});

// work filters

const filterButtons = document.querySelectorAll(".filter-button");

let activeFilters = [];

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;


        // all button clears every filter

        if (filter === "all") {

            activeFilters = [];

            filterButtons.forEach((button) => {
                button.classList.remove("active");
            });

            button.classList.add("active");

        }


        // toggle individual filters

        else {

            // remove all button from active state

            const allButton = document.querySelector(
                '.filter-button[data-filter="all"]'
            );

            allButton.classList.remove("active");


            if (activeFilters.includes(filter)) {

                activeFilters = activeFilters.filter(
                    (activeFilter) => activeFilter !== filter
                );

                button.classList.remove("active");

            }

            else {

                activeFilters.push(filter);

                button.classList.add("active");

            }


            // if no filters are selected, activate all

            if (activeFilters.length === 0) {
                allButton.classList.add("active");
            }

        }


        // filter gallery items

        galleryItems.forEach((item) => {

            const tags = item.dataset.tags
                ? item.dataset.tags
                    .split(",")
                    .map((tag) => tag.trim())
                : [];


            // show everything when all is selected

            if (activeFilters.length === 0) {

                item.classList.remove("hidden");

                return;
            }


            // item must have every selected tag

            const matches = activeFilters.every(
                (filter) => tags.includes(filter)
            );


            if (matches) {
                item.classList.remove("hidden");
            }

            else {
                item.classList.add("hidden");
            }

        });

    });

});