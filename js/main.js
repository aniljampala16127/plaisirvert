/**
 * Plaisir Vert - Main JavaScript
 * Handles all interactive elements on the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.nav-links .dropdown');
    
    dropdowns.forEach(dropdown => {
        // For mobile view, add click event to toggle dropdown
        const link = dropdown.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function(e) {
                // Only for mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            // Check if click is outside the menu and not on the toggle button
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    
    if (testimonialSlider && slides.length > 0) {
        let currentSlide = 0;
        
        // Function to set active slide
        function showSlide(n) {
            // Hide all slides
            slides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show current slide and activate current dot
            slides[n].style.display = 'block';
            dots[n].classList.add('active');
        }
        
        // Show first slide initially
        showSlide(currentSlide);
        
        // Next button click
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                currentSlide++;
                if (currentSlide >= slides.length) {
                    currentSlide = 0;
                }
                showSlide(currentSlide);
            });
        }
        
        // Previous button click
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = slides.length - 1;
                }
                showSlide(currentSlide);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto slide every 5 seconds
        setInterval(function() {
            if (!document.hidden) {  // Only change slides if page is visible
                currentSlide++;
                if (currentSlide >= slides.length) {
                    currentSlide = 0;
                }
                showSlide(currentSlide);
            }
        }, 5000);
    }
    
    // Chat Widget Toggle
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', function() {
            chatWidget.classList.toggle('open');
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', function(e) {
            if (chatWidget.classList.contains('open')) {
                if (!chatWidget.contains(e.target)) {
                    chatWidget.classList.remove('open');
                }
            }
        });
        
        // Prevent closing when clicking inside chat
        chatWidget.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // Remove any existing error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(message => message.remove());
            
            requiredFields.forEach(field => {
                field.classList.remove('error');
                
                // Check if field is empty
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    
                    field.parentNode.appendChild(errorMessage);
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Please enter a valid email address';
                        
                        field.parentNode.appendChild(errorMessage);
                    }
                }
                
                // Phone validation
                if (field.type === 'tel' && field.value.trim()) {
                    const phonePattern = /^[0-9\-\+\s\(\)]{10,15}$/;
                    if (!phonePattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Please enter a valid phone number';
                        
                        field.parentNode.appendChild(errorMessage);
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    window.scrollTo({
                        top: firstError.getBoundingClientRect().top + window.pageYOffset - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize any form success messages
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success') && urlParams.get('success') === 'true') {
        const formContainer = document.querySelector('.form-container');
        
        if (formContainer) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Your form has been submitted successfully! We will contact you shortly.';
            
            formContainer.prepend(successMessage);
            
            // Scroll to success message
            window.scrollTo({
                top: formContainer.getBoundingClientRect().top + window.pageYOffset - 100,
                behavior: 'smooth'
            });
        }
    }
    
    // Netlify Form Handling
    // This ensures forms work with Netlify's form handling
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
            if (!user) {
                window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                });
            }
        });
    }
});