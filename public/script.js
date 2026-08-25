// Navbar Icon

const btn = document.querySelector('.navbar-toggler');
const icon = document.getElementById('menuIcon');

btn.addEventListener('click', () => {

    if(icon.classList.contains('bi-list')){
        icon.classList.replace('bi-list','bi-x-lg');
    }else{
        icon.classList.replace('bi-x-lg','bi-list');
    }

});


// Counter Animation

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

    const target = +counter.getAttribute('data-target');

    let count = 0;

    const updateCounter = () => {

        count += Math.ceil(target / 80);

        if(count < target){
            counter.innerText = count;
            requestAnimationFrame(updateCounter);
        }
        else{
            counter.innerText = target + '+';
        }

    };

    updateCounter();

});
// ==========================================================================
// SCROLL RUNTIME ANIMATION INTERSECTION ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const targetSections = document.querySelectorAll('.scroll-animate-section');

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Triggers right when 15% of the section is visible
    };

    const globalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-visible');
                observer.unobserve(entry.target); // Runs cleanly once per page load
            }
        });
    }, observerOptions);

    targetSections.forEach(section => {
        globalObserver.observe(section);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const bioRows = document.querySelectorAll(".bio-stream-row");
    const imageDeck = document.querySelector(".abstract-image-deck-wrapper");
    const imageFrames = document.querySelectorAll(".deck-image-frame");

    bioRows.forEach(row => {
        // Triggered when cursor enters the bio row text region
        row.addEventListener("mouseenter", function () {
            const targetLeader = this.getAttribute("data-leader");
            
            // Add global helper class to dim non-focused elements
            imageDeck.classList.add("has-active-focus");
            
            // Find matching card framework and pull it forward
            imageFrames.forEach(frame => {
                if (frame.getAttribute("data-frame") === targetLeader) {
                    frame.classList.add("focused-front");
                } else {
                    frame.classList.remove("focused-front");
                }
            });
        });

        // Restores regular geometric image layout when cursor leaves
        row.addEventListener("mouseleave", function () {
            imageDeck.classList.remove("has-active-focus");
            imageFrames.forEach(frame => {
                frame.classList.remove("focused-front");
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const counterElements = document.querySelectorAll(".counter-value");
    
    const startCounting = (element) => {
        const target = parseInt(element.getAttribute("data-target"), 10);
        const duration = 2000; // Animation running duration in milliseconds
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic formula for a smooth deceleration look
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(easeProgress * target);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target; // Ensure perfect precise integer ending
            }
        };
        
        requestAnimationFrame(updateNumber);
    };

    // Observer options: fires when at least 20% of the grid section enters viewport
    const observerOptions = {
        threshold: 0.2,
        root: null
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                startCounting(element);
                observer.unobserve(element); // Stop observing once counting finishes
            }
        });
    }, observerOptions);

    counterElements.forEach(el => statsObserver.observe(el));
});
document.addEventListener("DOMContentLoaded", function () {
    const strips = document.querySelectorAll(".ecosystem-strip-row");

    strips.forEach(strip => {
        strip.addEventListener("mouseenter", function () {
            // Remove the active expansion class from all other horizontal elements
            strips.forEach(s => s.classList.remove("active-strip"));
            
            // Add focus expansion to the current hovered strip row
            this.classList.add("active-strip");
        });
    });
});

// ==========================================================================
// CUSTOM CURSOR (lavender dot + trailing ring)
// ==========================================================================

(function () {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursor.classList.add('visible');
        ring.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
        ring.classList.remove('visible');
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();
})();

// ==========================================================================
// SCROLL REVEAL ANIMATIONS (shared across all pages)
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const animElements = document.querySelectorAll(".animate-on-scroll, .anim-fade");
    if (animElements.length === 0) return;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
            }
        });
    }, observerOptions);

    animElements.forEach(el => {
        animObserver.observe(el);
    });
});

// ==========================================================================
// SCROLL PROGRESS CIRCLE
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
    const progressEl = document.getElementById('scrollProgress');
    const fillCircle = document.getElementById('progressFill');
    if (!progressEl || !fillCircle) return;

    const circumference = 106.8;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const progress = Math.min(scrollTop / docHeight, 1);
        const offset = circumference * (1 - progress);
        fillCircle.style.strokeDashoffset = offset;

        progressEl.classList.toggle('visible', scrollTop > 100);
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();

    progressEl.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ==========================================================================
// FORM SUBMISSION TO API
// ==========================================================================

var API_BASE = window.location.origin;

async function submitFormToAPI(formData) {
    var payload = {
        form_type: formData.formType,
        form_data: formData.data,
    };

    try {
        var res = await fetch(API_BASE + '/api/public/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            var errBody = await res.json().catch(function () { return {}; });
            console.error('Submit API error:', res.status, errBody);
        }
        return res.ok;
    } catch (e) {
        console.error('Form submission failed:', e);
        return false;
    }
}

async function submitFormWithFile(formData, fileInput) {
    var resumeUrl = '';
    if (fileInput && fileInput.files && fileInput.files[0]) {
        var fileData = new FormData();
        fileData.append('file', fileInput.files[0]);

        try {
            var uploadRes = await fetch(API_BASE + '/api/public/upload', {
                method: 'POST',
                body: fileData,
            });
            if (uploadRes.ok) {
                var uploadData = await uploadRes.json();
                resumeUrl = uploadData.url || '';
            } else {
                console.error('Upload failed with status', uploadRes.status);
            }
        } catch (e) {
            console.error('File upload failed:', e);
            return false;
        }
    }

    var payload = {
        form_type: formData.formType,
        form_data: formData.data,
    };
    if (resumeUrl) payload.resume_url = resumeUrl;

    try {
        var res = await fetch(API_BASE + '/api/public/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            var errBody = await res.json().catch(function () { return {}; });
            console.error('Submit API error:', res.status, errBody);
        }
        return res.ok;
    } catch (e) {
        console.error('Form submission failed:', e);
        return false;
    }
}

function removeNewsletterMessages(form) {
    var container = form.querySelector('.newsletter-msg-container');
    if (container) {
        container.querySelectorAll('.newsletter-success, .newsletter-error').forEach(function (el) { el.remove(); });
    }
    var nameContainer = form.querySelector('.newsletter-name-msg');
    if (nameContainer) {
        nameContainer.querySelectorAll('.newsletter-success, .newsletter-error').forEach(function (el) { el.remove(); });
    }
}

function showNewsletterMsg(form, inputEl, text, type) {
    removeNewsletterMessages(form);
    var isName = inputEl && inputEl.classList.contains('newsletter-name');
    var container = form.querySelector(isName ? '.newsletter-name-msg' : '.newsletter-msg-container');
    if (!container) return;
    var msg = document.createElement('span');
    msg.className = 'newsletter-' + type;
    msg.textContent = text;
    var isSuccess = type === 'success';
    msg.style.cssText = 'display:block;margin-top:6px;font-size:12px;font-weight:500;color:' + (isSuccess ? '#22c55e' : '#ef4444') + ';';
    container.appendChild(msg);
    if (isSuccess) {
        setTimeout(function () { msg.remove(); }, 4000);
    }
}

function initNewsletterForms() {
    var forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(function (form) {
        var emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;

        // Wrap name input so messages appear near it
        if (!form.querySelector('.newsletter-name-msg')) {
            var nameWrapper = document.createElement('div');
            nameWrapper.className = 'newsletter-name-msg';
            nameWrapper.style.cssText = 'display:flex;flex-direction:column;width:100%;';
            var nameInput = form.querySelector('.newsletter-name');
            if (nameInput) {
                nameInput.parentNode.insertBefore(nameWrapper, nameInput);
                nameWrapper.appendChild(nameInput);
            }
        }

        // Wrap email input in a container so messages sit below it in flex layout
        if (!form.querySelector('.newsletter-msg-container')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'newsletter-msg-container';
            wrapper.style.cssText = 'display:flex;flex-direction:column;width:100%;';
            emailInput.parentNode.insertBefore(wrapper, emailInput);
            wrapper.appendChild(emailInput);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            removeNewsletterMessages(form);

            var nameInput = form.querySelector('.newsletter-name');
            var container = form.querySelector('.newsletter-msg-container');
            var emailInput = container ? container.querySelector('input[type="email"]') : form.querySelector('input[type="email"]');
            if (!emailInput) return;

            var name = nameInput ? nameInput.value.trim() : '';
            var email = emailInput.value.trim();

            var nameRegex = /^[a-zA-Z\s.'-]+$/;
            if (!name) {
                showNewsletterMsg(form, form.querySelector('.newsletter-name'), 'Please enter your name', 'error');
                return;
            }
            if (!nameRegex.test(name)) {
                showNewsletterMsg(form, form.querySelector('.newsletter-name'), 'Please enter a valid name (letters only)', 'error');
                return;
            }

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showNewsletterMsg(form, emailInput, 'Please enter your email address', 'error');
                return;
            }
            if (!emailRegex.test(email)) {
                showNewsletterMsg(form, emailInput, 'Please enter a valid email address', 'error');
                return;
            }

            var ok = await submitFormToAPI({
                formType: 'newsletter',
                data: { name: name, email: email }
            });

            if (ok) {
                if (nameInput) nameInput.value = '';
                emailInput.value = '';
                showNewsletterMsg(form, emailInput, name ? name + ', you\'re subscribed!' : 'Subscribed successfully!', 'success');
            } else {
                showNewsletterMsg(form, emailInput, 'Subscription failed. Please try again.', 'error');
            }
        });
    });
}

// ==========================================================================
// SOCIAL MEDIA LINKS FROM ADMIN SETTINGS
// ==========================================================================

async function loadSocialLinks() {
    try {
        var res = await fetch('/api/public/settings');
        if (!res.ok) return;
        var settings = await res.json();
        var linkMap = {};
        settings.forEach(function (s) { linkMap[s.key] = s.value; });

        var socialLinks = document.querySelectorAll('.footer-social a');
        socialLinks.forEach(function (a) {
            var icon = a.querySelector('i');
            if (!icon) return;
            var classes = icon.className;
            if (classes.includes('bi-linkedin')) {
                a.href = linkMap.linkedin || 'https://www.linkedin.com/company/gensar-group/posts/?feedView=all';
            } else if (classes.includes('bi-instagram')) {
                a.href = linkMap.instagram || 'https://www.instagram.com/gensar_group/';
            }
        });
    } catch (e) {
        console.error('Failed to load social links:', e);
    }
}

// ==========================================================================
// DROPDOWN HOVER FIX (desktop only)
// ==========================================================================

(function () {
    function initDropdownHover() {
        var dropdowns = document.querySelectorAll('.custom-dropdown');
        if (!dropdowns.length) return;

        var isMobile = function () { return window.innerWidth < 992; };
        var closeTimeout = null;

        function showDropdown(dd) {
            if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
            dd.classList.add('show');
            var menu = dd.querySelector('.dropdown-menu');
            if (menu) menu.classList.add('show');
            var toggle = dd.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }

        function hideDropdown(dd) {
            dd.classList.remove('show');
            var menu = dd.querySelector('.dropdown-menu');
            if (menu) menu.classList.remove('show');
            var toggle = dd.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        dropdowns.forEach(function (dd) {
            dd.addEventListener('mouseenter', function () {
                if (isMobile()) return;
                showDropdown(dd);
            });

            dd.addEventListener('mouseleave', function () {
                if (isMobile()) return;
                closeTimeout = setTimeout(function () { hideDropdown(dd); }, 200);
            });

            var menu = dd.querySelector('.dropdown-menu');
            if (menu) {
                menu.addEventListener('mouseenter', function () {
                    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
                });
                menu.addEventListener('mouseleave', function () {
                    if (isMobile()) return;
                    hideDropdown(dd);
                });
            }

            // Prevent Bootstrap's click toggle on desktop to avoid conflicts
            var toggle = dd.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', function (e) {
                    if (!isMobile()) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }
        });

        // Also close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdowns.forEach(function (dd) { hideDropdown(dd); });
            }
        });
    }

    // Run after DOM ready; also re-run if Bootstrap replaces content
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDropdownHover);
    } else {
        initDropdownHover();
    }
})();

// Close mobile nav on outside click
document.addEventListener('click', function (e) {
    var navbar = document.querySelector('.custom-navbar');
    var navCollapse = document.getElementById('navbarNav');
    if (!navbar || !navCollapse) return;
    if (!navCollapse.classList.contains('show')) return;
    if (!navbar.contains(e.target)) {
        navCollapse.classList.remove('show');
        var menuIcon = document.getElementById('menuIcon');
        if (menuIcon) {
            menuIcon.classList.remove('bi-x-lg');
            menuIcon.classList.add('bi-list');
        }
        var toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.classList.add('collapsed');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    initNewsletterForms();
    loadSocialLinks();
});
