/**
 * Plaisir Vert - Form Validation
 * Handles enhanced form validation for all forms on the website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get all forms that need validation
    const forms = document.querySelectorAll('form[data-netlify="true"]');

    // Helper function to validate email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Helper function to validate phone number (Canadian format)
    const isValidPhone = (phone) => {
        // Allow various formats of Canadian phone numbers
        const regex = /^(\+?1[\s-]?)?\(?([0-9]{3})\)?[\s-]?([0-9]{3})[\s-]?([0-9]{4})$/;
        return regex.test(phone);
    };

    // Helper function to validate postal code (Canadian format)
    const isValidPostalCode = (postalCode) => {
        const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        return regex.test(postalCode);
    };

    // Helper function to create an error message
    const createErrorMessage = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        return errorDiv;
    };

    // Helper function to remove all error messages from a form
    const removeErrorMessages = (form) => {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
    };

    // Helper function to remove error class from inputs
    const removeErrorClasses = (form) => {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('error'));
    };

    // Handle form submission
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Remove any existing error messages and classes
            removeErrorMessages(form);
            removeErrorClasses(form);

            // Get all required inputs
            const requiredInputs = form.querySelectorAll('[required]');
            
            // Validate each required input
            requiredInputs.forEach(input => {
                // Check if input is empty
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    const fieldName = input.previousElementSibling?.textContent || 'This field';
                    const errorMessage = createErrorMessage(`${fieldName} is required`);
                    input.parentNode.appendChild(errorMessage);
                    return;
                }
                
                // Validate specific input types
                switch (input.type) {
                    case 'email':
                        if (!isValidEmail(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            const errorMessage = createErrorMessage('Please enter a valid email address');
                            input.parentNode.appendChild(errorMessage);
                        }
                        break;
                    
                    case 'tel':
                        if (input.value.trim() && !isValidPhone(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            const errorMessage = createErrorMessage('Please enter a valid phone number');
                            input.parentNode.appendChild(errorMessage);
                        }
                        break;
                }
                
                // Validate postal code field if it exists
                if (input.id === 'postal-code' && input.value.trim() && !isValidPostalCode(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    const errorMessage = createErrorMessage('Please enter a valid postal code (e.g., A1A 1A1)');
                    input.parentNode.appendChild(errorMessage);
                }
            });
            
            // Check if form has a checkbox consent field
            const consentCheckbox = form.querySelector('#consent');
            if (consentCheckbox && !consentCheckbox.checked) {
                isValid = false;
                consentCheckbox.classList.add('error');
                const errorMessage = createErrorMessage('You must consent to proceed');
                consentCheckbox.parentNode.appendChild(errorMessage);
            }
            
            // If the form is not valid, prevent submission
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to the first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    // Scroll with offset for header
                    window.scrollTo({
                        top: firstError.getBoundingClientRect().top + window.pageYOffset - 120,
                        behavior: 'smooth'
                    });
                    
                    // Focus on the first error field
                    firstError.focus();
                }
            }
        });
        
        // Real-time validation for better user experience
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', () => {
                // Remove existing error for this field
                const existingError = input.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                input.classList.remove('error');
                
                // Validate if required
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                    const fieldName = input.previousElementSibling?.textContent || 'This field';
                    const errorMessage = createErrorMessage(`${fieldName} is required`);
                    input.parentNode.appendChild(errorMessage);
                    return;
                }
                
                // Type-specific validation on blur
                if (input.value.trim()) {
                    switch (input.type) {
                        case 'email':
                            if (!isValidEmail(input.value)) {
                                input.classList.add('error');
                                const errorMessage = createErrorMessage('Please enter a valid email address');
                                input.parentNode.appendChild(errorMessage);
                            }
                            break;
                        
                        case 'tel':
                            if (!isValidPhone(input.value)) {
                                input.classList.add('error');
                                const errorMessage = createErrorMessage('Please enter a valid phone number');
                                input.parentNode.appendChild(errorMessage);
                            }
                            break;
                    }
                    
                    if (input.id === 'postal-code' && !isValidPostalCode(input.value)) {
                        input.classList.add('error');
                        const errorMessage = createErrorMessage('Please enter a valid postal code (e.g., A1A 1A1)');
                        input.parentNode.appendChild(errorMessage);
                    }
                }
            });
        });
    });

    // Form success message handling based on URL params
    const handleFormSuccess = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('success') && urlParams.get('success') === 'true') {
            const formContainers = document.querySelectorAll('.form-container');
            
            formContainers.forEach(container => {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your form has been submitted successfully! We will contact you shortly.';
                
                // Insert at the beginning of form container
                container.prepend(successMessage);
                
                // Scroll to success message
                window.scrollTo({
                    top: container.getBoundingClientRect().top + window.pageYOffset - 120,
                    behavior: 'smooth'
                });
                
                // Reset form if it exists
                const form = container.querySelector('form');
                if (form) {
                    form.reset();
                }
            });
        }
    };

    // Handle form success state
    handleFormSuccess();
});

/**
 * Special handling for the estimation form
 * This adds dynamic behavior to the lawn service selection
 */
document.addEventListener('DOMContentLoaded', () => {
    const estimateForm = document.querySelector('form[name="estimate-form"]');
    
    if (estimateForm) {
        // Toggle "other" service text field visibility
        const serviceOtherCheckbox = document.getElementById('service-other');
        const otherServicesField = document.getElementById('other-services');
        
        if (serviceOtherCheckbox && otherServicesField) {
            // Initial state
            otherServicesField.style.display = serviceOtherCheckbox.checked ? 'block' : 'none';
            
            // Toggle on change
            serviceOtherCheckbox.addEventListener('change', () => {
                otherServicesField.style.display = serviceOtherCheckbox.checked ? 'block' : 'none';
                
                if (serviceOtherCheckbox.checked) {
                    // Focus on the field if it becomes visible
                    otherServicesField.focus();
                }
            });
        }
        
        // Service selection logic
        const serviceCheckboxes = document.querySelectorAll('input[name="services[]"]');
        const frequencySelect = document.getElementById('frequency');
        
        if (serviceCheckboxes.length && frequencySelect) {
            // Update recommended frequency based on selected services
            const updateRecommendedFrequency = () => {
                let mowingSelected = false;
                let seasonalSelected = false;
                
                serviceCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        if (checkbox.value === 'Lawn Mowing') {
                            mowingSelected = true;
                        } else if (checkbox.value === 'Spring/Fall Cleanup') {
                            seasonalSelected = true;
                        }
                    }
                });
                
                // If mowing is selected, suggest weekly/bi-weekly
                if (mowingSelected && frequencySelect.value === '') {
                    // Create suggestion element
                    let suggestion = document.getElementById('frequency-suggestion');
                    if (!suggestion) {
                        suggestion = document.createElement('div');
                        suggestion.id = 'frequency-suggestion';
                        suggestion.className = 'form-text';
                        frequencySelect.parentNode.appendChild(suggestion);
                    }
                    
                    suggestion.textContent = 'Recommended: Weekly or Bi-weekly for lawn mowing services.';
                }
                
                // If seasonal cleanup is selected, suggest seasonal
                if (seasonalSelected && !mowingSelected && frequencySelect.value === '') {
                    // Create suggestion element
                    let suggestion = document.getElementById('frequency-suggestion');
                    if (!suggestion) {
                        suggestion = document.createElement('div');
                        suggestion.id = 'frequency-suggestion';
                        suggestion.className = 'form-text';
                        frequencySelect.parentNode.appendChild(suggestion);
                    }
                    
                    suggestion.textContent = 'Recommended: Seasonal for cleanup services.';
                }
            };
            
            // Check on change of any service checkbox
            serviceCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateRecommendedFrequency);
            });
            
            // Clear suggestion when user selects a frequency
            frequencySelect.addEventListener('change', () => {
                const suggestion = document.getElementById('frequency-suggestion');
                if (suggestion) {
                    suggestion.remove();
                }
            });
            
            // Initialize on page load
            updateRecommendedFrequency();
        }
    }
});