document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Nav Links
    const navLinks = document.querySelectorAll('.nav-links a, .hero-btns a, navbar .logo a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for sticky navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Form Validation & Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
        
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (!name.value.trim()) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        if (!message.value.trim()) {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        // Formspree / Web3Forms Handling
        formStatus.style.display = 'block';
        formStatus.innerHTML = 'Sending...';
        formStatus.style.color = 'var(--primary-color)';

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                formStatus.innerHTML = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = 'var(--accent-color)';
                contactForm.reset();
            } else {
                formStatus.innerHTML = 'Oops! ' + (result.message || 'Something went wrong.');
                formStatus.style.color = 'red';
            }
        } catch (error) {
            formStatus.innerHTML = 'Error! Could not connect to the server.';
            formStatus.style.color = 'red';
        }
    });

    // Simple fade-in effect on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});
