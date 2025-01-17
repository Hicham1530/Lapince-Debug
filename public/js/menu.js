function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    } else {
        console.error('L\'élément .nav-links n\'a pas été trouvé.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Si les éléments ne sont pas trouvés, on arrête le script pour éviter l'erreur
    if (!dropdownBtn || !dropdownMenu) return;

    // Gestion du clic sur le bouton
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la propagation du clic
        dropdownMenu.classList.toggle('show'); // Ajoute/enlève la classe "show"
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
    });
});