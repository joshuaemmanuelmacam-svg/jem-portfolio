// 0. GALLERY FILTER TOGGLE LOGIC
window.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleries = document.querySelectorAll('.gallery-showcase');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Hide all galleries and show the matching one
            const filter = button.getAttribute('data-filter');
            galleries.forEach(gallery => {
                if (gallery.getAttribute('data-category') === filter) {
                    gallery.classList.remove('force-hide'); // Show the matching gallery
                } else {
                    gallery.classList.add('force-hide'); // Hide others
                }
            });
        });
    });
});

// 1. App Entry Transition Handler
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.transform = 'translateY(-100%)';
        }
    }, 600);
});

// 2. High-Performance Navigation Active Tracker
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

const navOptions = { root: null, threshold: 0.2, rootMargin: "-15% 0px -50% 0px" };
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}, navOptions);
sections.forEach(section => navObserver.observe(section));

// 3. Staggered Entry Scroll Animator
const sectionOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px -80px 0px" };
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            const childrenToAnimate = entry.target.querySelectorAll(".reveal-item");
            childrenToAnimate.forEach((item, index) => {
                setTimeout(() => { item.classList.add("show"); }, index * 150);
            });
            sectionObserver.unobserve(entry.target);
        }
    });
}, sectionOptions);
document.querySelectorAll(".reveal").forEach(sec => sectionObserver.observe(sec));

// 4. SLEEK GALLERY LIGHTBOX CONTROLLER
const projectImages = {}; 

document.querySelectorAll('.gallery-showcase').forEach((showcase) => {
    const projectId = showcase.getAttribute('data-project');
    const images = showcase.querySelectorAll('.gallery-img');
    
    if (projectId && images.length > 0) {
        // Build the array mapping for the Lightbox UI
        projectImages[projectId] = Array.from(images).map(img => img.src);

        // Attach click listeners to the entire sleek card
        const cards = showcase.querySelectorAll('.sleek-card');
        cards.forEach((card, imgIndex) => {
            card.addEventListener('click', () => {
                openLightbox(projectId, imgIndex);
            });
        });
    }
});

const lightbox = document.getElementById('lightboxModal');
const displayContainer = document.querySelector('.lightbox-content-container');
const closeButton = document.querySelector('.lightbox-close');
let currentLightboxProject = '';
let currentLightboxIndex = 0;

function openLightbox(projectId, index) {
    currentLightboxProject = projectId;
    currentLightboxIndex = index;
    const itemSrc = projectImages[projectId][index];
    
    displayContainer.innerHTML = '';
    
    if (itemSrc.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = itemSrc;
        video.controls = true;
        video.autoplay = true;
        video.id = 'lightboxDisplayImg';
        displayContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = itemSrc;
        img.id = 'lightboxDisplayImg';
        displayContainer.appendChild(img);
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Optional: Stop video playback when closing
    const video = displayContainer.querySelector('video');
    if (video) {
        video.pause();
        video.src = ""; // Clears the video to stop background audio
    }
    displayContainer.innerHTML = ''; // Clean up
}

// Update the navigation logic to re-trigger openLightbox
function updateLightboxContent() {
    openLightbox(currentLightboxProject, currentLightboxIndex);
}

document.querySelector('.lightbox-next').addEventListener('click', () => {
    const list = projectImages[currentLightboxProject];
    currentLightboxIndex = (currentLightboxIndex + 1) % list.length;
    updateLightboxContent();
});

document.querySelector('.lightbox-prev').addEventListener('click', () => {
    const list = projectImages[currentLightboxProject];
    currentLightboxIndex = (currentLightboxIndex - 1 + list.length) % list.length;
    updateLightboxContent();
});


window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// 5. Download CV Payload System
document.getElementById('downloadCV').addEventListener('click', function(e) {
    e.preventDefault();
});



// 6. Form Submission Response Intercept
document.getElementById('contactForm').addEventListener('submit', function(e) {
    alert("Data packet transmitted successfully. Joshua will review and follow up shortly.");
});
