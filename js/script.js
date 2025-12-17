document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load Animation (for elements in the Hero section)
    // This adds the 'loaded' class to the body after a short delay, 
    // triggering the CSS transition for the hero elements.
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100); // Small delay to ensure CSS is rendered

    // 2. Scroll Animation (Intersection Observer for Features section)
    // This is for elements that come into view as the user scrolls down.

    const animatedElements = document.querySelectorAll('.animate-feature');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When element comes into view, add the 'in-view' class
                entry.target.classList.add('in-view');
                // Stop observing once the animation has been triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply the observer to all elements with the 'animate-feature' class
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});