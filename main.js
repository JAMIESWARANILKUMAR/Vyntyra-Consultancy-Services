document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Header on Scroll
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.fade-up, .service-card, .story-card');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Review Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            reviewCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Add a small animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // Optional: for hamburger animation
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Contact Form WhatsApp Redirection
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Get form values
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const service = this.querySelector('select[name="service"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            // Send data to backend (optional, keeps your Pabbly automation working)
            const formData = new FormData(this);
            fetch('http://127.0.0.1:8000/submit-enquiry/', {
                method: 'POST',
                body: formData
            }).catch(err => console.log('Backend submission failed:', err));

            // Format WhatsApp Message
            const whatsappMessage = `*New Enquiry from Website*
---------------------------
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Service:* ${service}
*Message:* ${message}`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Your WhatsApp Number (from footer)
            const phoneNumber = "919390515106"; 

            // Redirect to WhatsApp
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
            
            // Optional: Reset form
            this.reset();
        });
    }

    // Consent Modal Logic
    document.addEventListener('DOMContentLoaded', function() {
        const consentModal = document.getElementById('consent-modal');
        const cookieConsent = document.getElementById('cookie-consent');
        const termsConsent = document.getElementById('terms-consent');
        const btnAccept = document.getElementById('btn-accept');
        const btnDisagree = document.getElementById('btn-disagree');

        // Check if user has already accepted
        if (!localStorage.getItem('vyntyra_consent')) {
            // Show modal after a short delay
            setTimeout(() => {
                consentModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }, 1000);
        }

        // Function to check if both checkboxes are checked
        function checkConsent() {
            if (cookieConsent.checked && termsConsent.checked) {
                btnAccept.removeAttribute('disabled');
            } else {
                btnAccept.setAttribute('disabled', 'true');
            }
        }

        // Add event listeners to checkboxes
        cookieConsent.addEventListener('change', checkConsent);
        termsConsent.addEventListener('change', checkConsent);

        // Accept Button Click
        btnAccept.addEventListener('click', function() {
            localStorage.setItem('vyntyra_consent', 'true');
            consentModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Disagree Button Click
        btnDisagree.addEventListener('click', function() {
            alert("You must accept the policies to access the website.");
            // Optional: Redirect to Google or close tab
            // window.location.href = "https://www.google.com";
        });
    });
});
