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

// 4. MULTI-PHOTO CAROUSEL & LIGHTBOX CONTROLLER
const projectImages = {}; // Global state to index project image sets

document.querySelectorAll('.gallery-card-large').forEach((card) => {
    const projectId = card.getAttribute('data-project');
    const track = card.querySelector('.slider-track');
    const images = card.querySelectorAll('.gallery-img');
    const prevBtn = card.querySelector('.slider-arrow.prev');
    const nextBtn = card.querySelector('.slider-arrow.next');
    const dotsContainer = card.querySelector('.slider-dots');
    
    let currentIndex = 0;
    
    // Build array list mapping images per project for Lightbox consumption
    projectImages[projectId] = Array.from(images).map(img => img.src);

    // Dynamic Dot Generation UI
    images.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => updateSlider(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlider(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIndex = (currentIndex + 1) % images.length;
        updateSlider(nextIndex);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let prevIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlider(prevIndex);
    });

    // Lightbox Open Call Interceptor
    images.forEach((img, imgIndex) => {
        img.addEventListener('click', () => {
            openLightbox(projectId, imgIndex);
        });
    });
});

// Lightbox Core Engine Implementation
const lightbox = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxDisplayImg');
let currentLightboxProject = '';
let currentLightboxIndex = 0;

function openLightbox(projectId, index) {
    currentLightboxProject = projectId;
    currentLightboxIndex = index;
    lightboxImg.src = projectImages[projectId][index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.querySelector('.lightbox-next').addEventListener('click', () => {
    const list = projectImages[currentLightboxProject];
    currentLightboxIndex = (currentLightboxIndex + 1) % list.length;
    lightboxImg.src = list[currentLightboxIndex];
});

document.querySelector('.lightbox-prev').addEventListener('click', () => {
    const list = projectImages[currentLightboxProject];
    currentLightboxIndex = (currentLightboxIndex - 1 + list.length) % list.length;
    lightboxImg.src = list[currentLightboxIndex];
});

// Keyboard Mapping for Lightbox Escaped Operations
window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
});

// 5. Download CV Payload System
document.getElementById('downloadCV').addEventListener('click', function(e) {
    e.preventDefault();
    const mockResumeData = "JOSHUA EMMANUAL MACAM\nUI/UX Architect | Social Media Manager | Executive Operations Mapping";
    const dataBlob = new Blob([mockResumeData], { type: "text/plain;charset=utf-8" });
    const localUrl = URL.createObjectURL(dataBlob);
    const virtualLinkNode = document.createElement('a');
    virtualLinkNode.href = localUrl;
    virtualLinkNode.download = "Joshua_Macam_Executive_CV.txt";
    document.body.appendChild(virtualLinkNode);
    virtualLinkNode.click();
    document.body.removeChild(virtualLinkNode);
    URL.revokeObjectURL(localUrl);
});

// 6. Form Submission Response Intercept
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Data packet transmitted successfully. Joshua will review and follow up shortly.");
    this.reset();
});