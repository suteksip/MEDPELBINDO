// Handle navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navIcon = document.getElementById('navIcon');
    const topNav = document.getElementById('topNav');
    const navLinks = document.getElementById('navLinks');
    const mainContent = document.getElementById('mainContent');

    if (navToggle && navIcon && topNav && navLinks) {
        navToggle.addEventListener('click', function() {
            topNav.classList.toggle('collapsed');
            navLinks.classList.toggle('active');
            mainContent.classList.toggle('expanded');
            
            // Toggle icon
            if (topNav.classList.contains('collapsed')) {
                navIcon.classList.remove('fa-bars');
                navIcon.classList.add('fa-times');
            } else {
                navIcon.classList.remove('fa-times');
                navIcon.classList.add('fa-bars');
            }
        });
    }

    // Check if user is logged in
    const userName = localStorage.getItem('userName');
    const userGreeting = document.getElementById('userGreeting');
    const logoutButton = document.getElementById('logoutButton');

    if (!userName && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
        return;
    }

    // Update greeting if elements exist
    if (userGreeting && userName) {
        userGreeting.textContent = `Hai, ${userName}!`;
    }

    // Handle logout if button exists
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        });
    }
});
