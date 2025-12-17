document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load Animation (existing code)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // 2. Scroll Animation (existing code)
    const animatedElements = document.querySelectorAll('.animate-feature');
    // ... (Observer setup remains the same) ...
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- 3. Dark Mode Toggle (NEW) ---

    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Function to apply the saved theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            toggleButton.textContent = '🌙'; // Moon icon for dark mode
        } else {
            body.classList.remove('dark-mode');
            toggleButton.textContent = '☀️'; // Sun icon for light mode
        }
    };

    // Load saved theme from localStorage, default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event listener for the button
    toggleButton.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Apply and save the new theme
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

});