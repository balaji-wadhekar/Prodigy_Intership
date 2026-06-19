// Select the navigation bar element
const navbar = document.getElementById('navbar');

// Add a scroll event listener to the window object
window.addEventListener('scroll', () => {
    // Check the vertical scroll position of the window
    // If the user has scrolled more than 50px from the top
    if (window.scrollY > 50) {
        // Add the 'scrolled' class to the navigation bar
        // This triggers the CSS rules to change background and text colors
        navbar.classList.add('scrolled');
    } else {
        // Otherwise, remove the 'scrolled' class
        // Reverts the navbar to its initial transparent state
        navbar.classList.remove('scrolled');
    }
});
