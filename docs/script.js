// --- Updated JavaScript ---

/**
 * Main function executed when the DOM is fully loaded.
 * Initializes various components like loader, theme toggle, navigation,
 * form handling, and animations.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check for user preference regarding reduced motion
    const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    // Initialize Page Loader
    initPageLoader();

    // Initialize Theme Toggle
    initThemeToggle();

    // Initialize Mobile Navigation
    initMobileNav(isReducedMotion);

    // Initialize Contact Form Submission
    initContactForm();

    // Initialize Active Navigation Link Highlighting on Scroll
    initNavHighlighting();

    // Animations are initialized after the page loader finishes in initPageLoader()

}); // End of DOMContentLoaded listener

// --- Initialization Functions ---

/**
 * Handles the page loading animation.
 * Shows a loader, waits for the window to load, ensures a minimum display time,
 * then fades out the loader and triggers content animations.
 */
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) {
        // If no loader element exists, trigger animations immediately
        console.warn("Page loader element not found. Skipping loader logic.");
        initContentAnimations();
        return;
    }

    // Ensure loader is visible initially, especially if JS execution is delayed
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';

    const minLoaderTime = 1000; // Minimum time loader should be visible (in ms)
    const startTime = Date.now();

    // Function to hide the loader - extracted for clarity and reuse
    const hideLoader = () => {
        console.log("Hiding loader...");
        // Directly apply styles to ensure the loader disappears
        loader.classList.add('loaded');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
       
        // Also apply transition in case CSS is not being applied
        loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
       
        // Trigger content animations after a short delay
        setTimeout(initContentAnimations, 600); // Reduced from 1000ms to 600ms
    };

    // Define a safety timeout to ensure the loader disappears even if the load event doesn't fire
    const safetyTimeout = setTimeout(() => {
        console.log("Safety timeout triggered - forcing loader to hide");
        hideLoader();
    }, 5000); // Force hide after 5 seconds no matter what

    // Wait for the entire window (including images, etc.) to load
    window.addEventListener('load', () => {
        console.log("Window loaded event fired");
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoaderTime - elapsedTime);

        // Clear the safety timeout since load event fired
        clearTimeout(safetyTimeout);

        // Wait for minimum time before hiding loader
        setTimeout(hideLoader, remainingTime);
    });

    // Add DOMContentLoaded event as a fallback (in case it wasn't already fired)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOMContentLoaded event fired");
            // If window load hasn't fired after 2 seconds from DOM being ready, hide the loader
            setTimeout(() => {
                if (loader.style.visibility !== 'hidden') {
                    console.log("Fallback: hiding loader after DOMContentLoaded + 2s");
                    hideLoader();
                }
            }, 2000);
        });
    } else {
        // If DOMContentLoaded already fired but window.load is taking too long
        setTimeout(() => {
            if (loader.style.visibility !== 'hidden') {
                console.log("Fallback: hiding loader when DOMContentLoaded already fired");
                hideLoader();
            }
        }, 2000);
    }
}
/**
 * Sets up the dark/light theme toggle functionality.
 * Reads user preference from localStorage or system settings,
 * and adds event listener to the toggle button.
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i'); // Optional chaining in case element doesn't exist
    if (!themeToggle || !themeIcon) {
        console.warn("Theme toggle button or icon not found. Skipping theme toggle setup.");
        return;
    }

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('theme');

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    };

    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light
    }

    // Add click listener to toggle theme
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    });

     // Listen for system theme changes (optional)
     prefersDarkScheme.addEventListener('change', (e) => {
        // Only change if no theme is explicitly set in localStorage
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Initializes the mobile navigation (burger menu).
 * Toggles the navigation menu visibility and animates links on click.
 * Closes the menu when a navigation link is clicked.
 * @param {boolean} isReducedMotion - Indicates if reduced motion is preferred.
 */
function initMobileNav(isReducedMotion) {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (!burger || !nav) {
         console.warn("Burger menu or nav links not found. Skipping mobile nav setup.");
         return;
    }
    const navLinks = nav.querySelectorAll('li a'); // Select links inside li

    burger.addEventListener('click', () => {
        const isActive = nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        // Set ARIA attribute for accessibility
        burger.setAttribute('aria-expanded', isActive);

        // Animate nav links (only if not preferring reduced motion)
        if (!isReducedMotion) {
            nav.querySelectorAll('li').forEach((link, index) => {
                // Reset animation before applying it again
                link.style.animation = '';
                if (isActive) {
                    // Apply animation with delay
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        }
    });

    // Close nav when a link is clicked
     navLinks.forEach(link => {
         link.addEventListener('click', () => {
             if (nav.classList.contains('nav-active')) {
                 nav.classList.remove('nav-active');
                 burger.classList.remove('toggle');
                 burger.setAttribute('aria-expanded', 'false');
                 // Reset animations if they were applied
                 if (!isReducedMotion) {
                     nav.querySelectorAll('li').forEach(li => li.style.animation = '');
                 }
             }
         });
     });
}

/**
 * Sets up the contact form submission using Web3Forms.
 * Handles form data, sends it to the API endpoint, and displays status messages.
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status'); // Element to display success/error
    if (!contactForm || !formStatus) {
        console.warn("Contact form or status element not found. Skipping form setup.");
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default page reload

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        formStatus.textContent = ''; // Clear previous status messages
        formStatus.style.color = 'inherit'; // Reset color

        const formData = new FormData(contactForm);
        // Convert FormData to a plain object for JSON stringification
        const formObject = {};
        formData.forEach((value, key) => { formObject[key] = value });
        const jsonRequestBody = JSON.stringify(formObject);

        // Web3Forms endpoint
        const endpointURL = 'https://api.web3forms.com/submit';

        fetch(endpointURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Request JSON response
            },
            body: jsonRequestBody
        })
        .then(async (response) => {
            let jsonResponse = await response.json(); // Parse the JSON response from Web3Forms
            if (response.ok && jsonResponse.success) { // Check for HTTP 2xx status and success flag
                formStatus.textContent = jsonResponse.message || "Message sent successfully!";
                formStatus.style.color = 'var(--primary-color)'; // Use theme color for success
                contactForm.reset(); // Clear the form fields
                // Optionally hide status message after a few seconds
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            } else {
                // Handle errors reported by Web3Forms or network issues
                console.error('Web3Forms submission error:', jsonResponse);
                formStatus.textContent = jsonResponse.message || "An error occurred sending the message.";
                formStatus.style.color = '#e74c3c'; // Use a distinct error color (e.g., red)
            }
        })
        .catch(error => {
            // Handle network errors (e.g., user offline)
            console.error('Form submission fetch error:', error);
            formStatus.textContent = 'Could not send message. Please check your network connection.';
            formStatus.style.color = '#e74c3c';
        })
        .finally(() => {
            // Restore the button state regardless of success or failure
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
}

/**
 * Initializes the active navigation link highlighting based on scroll position.
 * Uses IntersectionObserver (if available) or scroll events with debouncing.
 */
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]'); // Select sections that have an ID
    const navLinks = document.querySelectorAll('.nav-links li a'); // Select the actual anchor tags

    if (sections.length === 0 || navLinks.length === 0) {
        console.warn("No sections with IDs or navigation links found. Skipping nav highlighting.");
        return;
    }

    // Use IntersectionObserver for performance if supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // Observe relative to the viewport
            rootMargin: "-50% 0px -50% 0px", // Trigger when section is in the middle 50% of the viewport
            threshold: 0 // Trigger as soon as any part enters/leaves the rootMargin area
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-links a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    // Remove active class from all links first
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to the corresponding link
                    correspondingLink?.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    } else {
        // Fallback to scroll event listener with debouncing
        console.log("IntersectionObserver not supported, falling back to scroll listener for nav highlighting.");
        const debouncedNavHighlighter = debounce(highlightNavOnScroll, 100); // Debounce scroll handler
        window.addEventListener('scroll', debouncedNavHighlighter);
        highlightNavOnScroll(); // Initial call to set active link on load
    }
}

/**
 * Scroll event handler (fallback) to highlight the active navigation link.
 */
function highlightNavOnScroll() {
     const sections = document.querySelectorAll('section[id]');
     const navLinks = document.querySelectorAll('.nav-links li a');
     let scrollY = window.pageYOffset;
     let currentSectionId = "";

     sections.forEach(section => {
         const sectionHeight = section.offsetHeight;
         // Adjust offset to trigger highlight slightly before the section top hits the viewport top
         const sectionTop = section.offsetTop - 150; // Adjust this offset as needed

         if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
             currentSectionId = section.getAttribute('id');
         }
     });

     navLinks.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href') === `#${currentSectionId}`) {
             link.classList.add('active');
         }
     });

     // Special case for the top of the page (highlight Home)
     // Check if scrollY is less than the top of the first section minus the offset
     if (currentSectionId === "" && scrollY < (sections[0]?.offsetTop - 150 || 0)) {
         const homeLink = document.querySelector('.nav-links a[href="#home"]');
         homeLink?.classList.add('active');
     }
}


// --- Animation & Utility Functions ---

/**
 * Initializes content animations like fade-ins and counters.
 * Checks for reduced motion preference before applying animations.
 */
function initContentAnimations() {
    const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    // --- Typing Animation ---
    const subtitleElement = document.getElementById('subtitle');
    if (subtitleElement) {
        const textToType = "Computer Science Student"; // Text for the animation
        if (!isReducedMotion) {
            typeWriter(subtitleElement, textToType, 100); // Adjust speed (ms per char) as needed
        } else {
            // If reduced motion is preferred, display the text immediately without animation or cursor
            const cursor = subtitleElement.querySelector('.cursor');
            subtitleElement.textContent = textToType; // Set text directly
            if(cursor) cursor?.remove(); // Remove cursor element
        }
    } else {
        console.warn("Subtitle element for typing animation not found.");
    }

    // --- Fade-in Animations on Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        if ('IntersectionObserver' in window && !isReducedMotion) {
            const appearOptions = {
                threshold: 0.15, // Trigger when 15% of the element is visible
                rootMargin: "0px 0px -50px 0px" // Trigger animation slightly before element is fully in view
            };

            const appearOnScroll = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear'); // Add class to trigger CSS animation

                        // Special handling for the CPD counter animation
                        if (entry.target.id === 'development' && !entry.target.classList.contains('counted')) {
                            animateCPDCounter(entry.target); // Animate the counter
                            entry.target.classList.add('counted'); // Mark as counted
                        }

                        observer.unobserve(entry.target); // Stop observing once the animation is triggered
                    }
                });
            }, appearOptions);

            fadeElements.forEach(element => {
                appearOnScroll.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver or if reduced motion is preferred
            fadeElements.forEach(element => {
                element.classList.add('appear'); // Make elements visible immediately
                 // Still trigger counter if visible on load (no observer/reduced motion)
                 if (element.id === 'development' && !element.classList.contains('counted')) {
                     const counterElement = element.querySelector('#cpd-hours');
                     if (counterElement) {
                        const totalHours = calculateTotalCPDHours(element);
                        counterElement.textContent = totalHours; // Set final value directly
                     }
                     element.classList.add('counted');
                 }
            });
        }
    } else {
        console.warn("No elements with class 'fade-in' found for animations.");
    }
}

/**
 * Calculates the total hours from CPD items within a given parent element.
 * @param {HTMLElement} parentElement - The element containing the CPD items.
 * @returns {number} - The total calculated CPD hours.
 */
function calculateTotalCPDHours(parentElement) {
    let totalHours = 0;
    const hourParagraphs = parentElement.querySelectorAll('.cpd-item .cpd-details p:first-child');
    hourParagraphs.forEach(p => {
        const strong = p.querySelector('strong');
        if (strong && strong.textContent.trim().toLowerCase() === 'hours:') {
            const textNode = strong.nextSibling;
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                const hours = parseInt(textNode.textContent.trim(), 10);
                if (!isNaN(hours)) {
                    totalHours += hours;
                } else {
                    console.warn("Could not parse CPD hours:", textNode.textContent);
                }
            }
        }
    });
    return totalHours;
}

function animateCPDCounter(developmentSection) {
    const totalHours = calculateTotalCPDHours(developmentSection);
    animateCounter('cpd-hours', 0, totalHours, 1500); // Animate over 1.5 seconds
}

function animateCounter(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Finds the CPD counter element and initiates its animation.
 * @param {HTMLElement} developmentSection - The development section element.
 */
function animateCPDCounter(developmentSection) {
    const totalHours = calculateTotalCPDHours(developmentSection);
    animateCounter('cpd-hours', 0, totalHours, 1500); // Animate from 0 to totalHours over 1.5 seconds
}


/**
 * Simulates a typewriter effect for a given text element.
 * @param {HTMLElement} element - The HTML element to display the text in.
 * @param {string} text - The string to type out.
 * @param {number} speed - The delay (in ms) between typing each character.
 */
function typeWriter(element, text, speed) {
    let i = 0;
    // Clear existing content and add cursor span
    element.innerHTML = '<span class="cursor" aria-hidden="true"></span>';
    const cursor = element.querySelector('.cursor');
    if (!cursor) return; // Exit if cursor element isn't found

    function type() {
        if (i < text.length) {
            // Insert the next character before the cursor
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
            setTimeout(type, speed);
        } else {
            // Fix: Uncomment and enable this line to hide the cursor when typing finishes
            cursor.style.display = 'none';
            // You could also stop the animation instead:
            // cursor.style.animation = 'none';
        }
    }
    // Start the typing process
    requestAnimationFrame(type); // Use requestAnimationFrame for smoother start
}

/**
 * Debounce function to limit the rate at which a function can fire.
 * Useful for performance optimization of event listeners like scroll or resize.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The debounce delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args); // Use apply to preserve context and arguments
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
