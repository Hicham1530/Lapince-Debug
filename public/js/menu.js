function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    } else {
        console.error('L\'élément .nav-links n\'a pas été trouvé.');
    }
}