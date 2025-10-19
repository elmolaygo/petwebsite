document.querySelectorAll('a[href="index.html"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'main.html';
  });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pet Adoption Website loaded!');
    
    initializeNavigation();
    
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'pet':
            initializePetsPage();
            break;
        case 'adoption':
            initializeAdoptionForm();
            break;
        case 'about':
            initializeAboutPage();
            break;
        default:
            initializeHomePage();
    }
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('pet.html')) return 'pets';
    if (path.includes('adoption-form.html')) return 'adoption-form';
    if (path.includes('about.html')) return 'about';
    return 'home';
}

function initializeHomePage() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    animateStatsOnScroll();
}

function animateStatsOnScroll() {
    const stats = document.querySelectorAll('.stat-item h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                animateNumber(target, finalValue);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, finalValue) {
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    const suffix = finalValue.replace(/\d/g, '');
    let current = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

function initializePetsPage() {
    initializeCategoryTabs();
    initializePetCards();
}

function initializeCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const petCards = document.querySelectorAll('.pet-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            filterPets(category, petCards);
        });
    });
}

function filterPets(category, petCards) {
    petCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializePetCards() {
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px) scale(1)';
        });
    });
}

function adoptPet(petName, petBreed) {
    sessionStorage.setItem('selectedPet', JSON.stringify({
        name: petName,
        breed: petBreed
    }));
    
    window.location.href = 'adaption.html';
}
function initializeAdoptionForm() {
    loadSelectedPetInfo();
    setupFormValidation();
    setupFormSubmission();
}

function loadSelectedPetInfo() {
    const selectedPet = JSON.parse(sessionStorage.getItem('selectedPet'));
    
    if (selectedPet) {
        document.getElementById('pet-name').textContent = selectedPet.name;
        document.getElementById('pet-breed').textContent = selectedPet.breed;
    } else {
        document.getElementById('pet-name').textContent = 'No pet selected';
        document.getElementById('pet-breed').textContent = 'Please go back and select a pet';
    }
}

function setupFormValidation() {
    const form = document.getElementById('adoption-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    field.classList.remove('error');
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function setupFormSubmission() {
    const form = document.getElementById('adoption-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        const agreementCheckbox = document.getElementById('agreement');
        if (!agreementCheckbox.checked) {
            showFieldError(agreementCheckbox, 'You must agree to the terms');
            isValid = false;
        }
        
        if (isValid) {
            submitAdoptionForm(form);
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function submitAdoptionForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        const selectedPet = JSON.parse(sessionStorage.getItem('selectedPet'));
        const petName = selectedPet ? selectedPet.name : 'Unknown Pet';
        
        showSuccessModal(petName);
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        form.reset();
        
        sessionStorage.removeItem('selectedPet');
        
    }, 2000);
}

function showSuccessModal(petName) {
    const modal = document.getElementById('success-modal');
    const modalPetName = document.getElementById('modal-pet-name');
    
    modalPetName.textContent = petName;
    modal.style.display = 'block';
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    
    setTimeout(() => {
        window.location.href = 'pets.html';
    }, 500);
}

function goBack() {
    window.history.back();
}
function initializeAboutPage() {
    initializeTeamCards();
    animateValuesOnScroll();
}

function initializeTeamCards() {
    const teamCards = document.querySelectorAll('.team-member');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function animateValuesOnScroll() {
    const valueCards = document.querySelectorAll('.value-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    valueCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #e74c3c;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
    `;
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.remove();
            }
        }, 500);
    });
}

showLoadingAnimation();

function addScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .pet-card, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}
document.addEventListener('DOMContentLoaded', addScrollAnimations);