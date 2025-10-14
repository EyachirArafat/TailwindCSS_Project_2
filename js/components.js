// components.js - Reusable UI Components

class ComponentLoader {
  constructor() {
    this.loadComponents();
  }

  async loadComponents() {
    await this.loadNavbar();
    await this.loadFooter();
    this.initializeComponents();
  }

  async loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const navbar = `
      <nav class="navbar fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between py-4">
            <!-- Logo -->
            <div class="flex items-center gap-4">
              <a href="/index.html" class="flex items-center gap-2">
                <img class="h-10" src="/assets/tickerAI-logo 1.png" alt="TickerAI">
                <span class="font-bold text-xl hidden sm:block">TickerAI</span>
              </a>
            </div>

            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center gap-6">
              <a href="/index.html" class="nav-link">Home</a>
              <a href="/pages/dashboard.html" class="nav-link">Dashboard</a>
              <a href="/pages/news.html" class="nav-link">News</a>
              <a href="/pages/portfolio.html" class="nav-link">Portfolio</a>
              <a href="/pages/analysis.html" class="nav-link">Analysis</a>
              <a href="/pages/contact.html" class="nav-link">Contact</a>
            </div>

            <!-- Right Section -->
            <div class="flex items-center gap-3">
              <button class="icon-btn" onclick="openSearch()">
                <i class="fas fa-search"></i>
              </button>
              <button class="icon-btn relative" onclick="openNotifications()">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
              </button>
              <button class="icon-btn" id="themeToggle">
                <i class="fas fa-moon dark:hidden"></i>
                <i class="fas fa-sun hidden dark:block"></i>
              </button>
              <div class="relative">
                <button class="user-avatar" onclick="toggleUserMenu()">
                  <img src="/assets/images/avatar.jpg" alt="User" class="w-8 h-8 rounded-full">
                </button>
                <div id="userMenu" class="user-dropdown hidden">
                  <a href="/pages/dashboard.html" class="dropdown-item">
                    <i class="fas fa-chart-line"></i> Dashboard
                  </a>
                  <a href="/pages/portfolio.html" class="dropdown-item">
                    <i class="fas fa-briefcase"></i> Portfolio
                  </a>
                  <a href="/pages/settings.html" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                  </a>
                  <hr class="my-2 border-gray-200 dark:border-gray-700">
                  <a href="/pages/login.html" class="dropdown-item text-red-600">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </a>
                </div>
              </div>
              <button class="lg:hidden" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div id="mobileMenu" class="mobile-menu hidden lg:hidden">
            <a href="/index.html" class="mobile-menu-item">Home</a>
            <a href="/pages/dashboard.html" class="mobile-menu-item">Dashboard</a>
            <a href="/pages/news.html" class="mobile-menu-item">News</a>
            <a href="/pages/portfolio.html" class="mobile-menu-item">Portfolio</a>
            <a href="/pages/analysis.html" class="mobile-menu-item">Analysis</a>
            <a href="/pages/contact.html" class="mobile-menu-item">Contact</a>
          </div>
        </div>
      </nav>
    `;

    placeholder.innerHTML = navbar;
  }

  async loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const footer = `
      <footer class="bg-gray-900 text-white py-12 mt-auto">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/assets/tickerAI-logo 1.png" alt="TickerAI" class="h-10 mb-4 brightness-0 invert">
              <p class="text-gray-400">AI-powered financial intelligence platform providing real-time market insights.</p>
              <div class="flex gap-3 mt-4">
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
              </div>
            </div>
            <div>
              <h4 class="font-bold mb-4">Quick Links</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="/pages/about.html" class="hover:text-white">About Us</a></li>
                <li><a href="#" class="hover:text-white">Features</a></li>
                <li><a href="#" class="hover:text-white">Pricing</a></li>
                <li><a href="#" class="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Support</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white">Help Center</a></li>
                <li><a href="/pages/contact.html" class="hover:text-white">Contact</a></li>
                <li><a href="#" class="hover:text-white">API Docs</a></li>
                <li><a href="#" class="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Legal</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                <li><a href="#" class="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" class="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TickerAI. All rights reserved. A Mark Cuban Company.</p>
          </div>
        </div>
      </footer>
    `;

    placeholder.innerHTML = footer;
  }

  initializeComponents() {
    // Setup global functions
    window.toggleUserMenu = () => {
      const menu = document.getElementById('userMenu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    };

    window.toggleMobileMenu = () => {
      const menu = document.getElementById('mobileMenu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    };

    window.openSearch = () => {
      // Implement search modal
      console.log('Open search');
    };

    window.openNotifications = () => {
      // Implement notifications panel
      console.log('Open notifications');
    };

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-avatar')) {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
          userMenu.classList.add('hidden');
        }
      }
    });
  }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  new ComponentLoader();
});