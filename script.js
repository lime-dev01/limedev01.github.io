document.addEventListener('DOMContentLoaded', () => {

  // 1. FILTRES DE LA GALERIE (Corrigé pour la grille CSS)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const photoCards = document.querySelectorAll('.photo-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.getAttribute('data-filter');

      photoCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block'; // Force l'affichage en bloc dans la grille
        } else {
          card.style.display = 'none';  // Cache proprement
        }
      });
    });
  });

  // 2. DIAPORAMA & LIGHTBOX (FLÈCHES GAUCHE / DROITE)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.prev-lightbox');
  const nextBtn = document.querySelector('.next-lightbox');

  let imagesList = [];
  let currentIndex = 0;

  function updateImagesList() {
    imagesList = Array.from(document.querySelectorAll('.photo-wrapper img')).filter(img => {
      const card = img.closest('.photo-card');
      return card && window.getComputedStyle(card).display !== 'none';
    });
  }

  document.querySelectorAll('.photo-wrapper img').forEach(img => {
    img.addEventListener('click', () => {
      updateImagesList();
      currentIndex = imagesList.indexOf(img);
      if (currentIndex !== -1 && lightbox && lightboxImg) {
        lightboxImg.src = imagesList[currentIndex].src;
        lightbox.style.display = 'flex';
      }
    });
  });

  function showImage(index) {
    if (imagesList.length === 0) return;
    if (index < 0) index = imagesList.length - 1;
    if (index >= imagesList.length) index = 0;
    currentIndex = index;
    lightboxImg.src = imagesList[currentIndex].src;
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'Escape') lightbox.style.display = 'none';
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });

  // 3. ANIMATION D'APPARITION AU DÉFILEMENT (SCROLL)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-element');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.bio-card, .contact-card').forEach(el => {
    el.classList.add('hidden-element');
    observer.observe(el);
  });
});
