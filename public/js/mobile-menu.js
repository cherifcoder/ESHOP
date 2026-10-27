document.addEventListener('DOMContentLoaded', function() {
  // Create mobile header and menu toggle
  if (window.innerWidth <= 968) {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Create mobile header
    const mobileHeader = document.createElement('header');
    mobileHeader.className = 'mobile-header';
    mobileHeader.innerHTML = `
      <div class="mobile-header-left">
        <button class="menu-toggle" id="menuToggle">
          <i class="fas fa-bars"></i>
        </button>
        <div class="mobile-logo">
          <i class="fas fa-store"></i>
          <span>GESTION BOUTIQUE</span>
        </div>
      </div>
    `;
    
    if (mainContent) {
      mainContent.insertBefore(mobileHeader, mainContent.firstChild);
    }
    
    // Toggle menu
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
    
    // Close menu when clicking on menu item
    const menuItems = document.querySelectorAll('.sidebar .menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    });
  }
  
  // Handle resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 968) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar) sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  });
});
