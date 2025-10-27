document.addEventListener('DOMContentLoaded', () => {
    // --- Existing JS for Achievement Card (Kept) ---
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            console.log(`Achievement clicked: ${title}`);
        });
    });


    const playerSpotlightSection = document.querySelector('.player-spotlight-column');
    let hasAnimated = false; 

    const animateNumber = (element, start, end, duration) => {
        let startTime = null;
        const decimalPlaces = (end.toString().split('.')[1] || '').length;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = start + (progress * (end - start));
            element.textContent = currentValue.toFixed(decimalPlaces);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const runStatsAnimation = () => {
        if (hasAnimated) return; 

        const statItems = playerSpotlightSection.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const statValueSpan = item.querySelector('.stat-value');
            const targetValue = parseFloat(item.dataset.value);
            
            if (statValueSpan && !isNaN(targetValue)) {
                animateNumber(statValueSpan, 0, targetValue, 1500);
            }
        });
        hasAnimated = true; 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runStatsAnimation();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 
    });

    if (playerSpotlightSection) {
        observer.observe(playerSpotlightSection);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            console.log(`Achievement clicked: ${title}`);
        });
    });

    const tryoutForm = document.getElementById('tryoutRegistrationForm');

    if (tryoutForm) {
        tryoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('input-error');
                } else {
                    field.classList.remove('input-error');
                }
            });

            if (isValid) {
                const formData = new FormData(this);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                console.log('Tryout Registration Data Submitted:', data);
                alert('🎉 Registration successful! A team manager will contact you soon for camp details.');
                this.reset();
            } else {
                alert('Please fill out all mandatory fields (*).');
            }
        });
    }

    // --- JS FOR PLAYER STATS ANIMATION (Kept and Working) ---

    const playerSpotlightSection = document.querySelector('.player-spotlight-column');
    let hasAnimated = false;

    const animateNumber = (element, start, end, duration) => {
        let startTime = null;
        const decimalPlaces = (end.toString().split('.')[1] || '').length;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = start + (progress * (end - start));
            element.textContent = currentValue.toFixed(decimalPlaces);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const runStatsAnimation = () => {
        if (hasAnimated) return;

        const statItems = playerSpotlightSection.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const statValueSpan = item.querySelector('.stat-value');
            const targetValue = parseFloat(item.dataset.value);
            
            if (statValueSpan && !isNaN(targetValue)) {
                animateNumber(statValueSpan, 0, targetValue, 1500);
            }
        });
        hasAnimated = true;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runStatsAnimation();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    if (playerSpotlightSection) {
        observer.observe(playerSpotlightSection);
    }
});