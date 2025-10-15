// main.js - Core Application Logic

// Initialize Application
class App {
  constructor() {
    this.init();
  }

  init() {
    // this.setupTheme();
    this.setupNavigation();
    this.setupEventListeners();
    this.initializeModules();
  }

  // setupTheme() {
  //   const theme = localStorage.getItem("theme") || "light";
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   }

  //   const themeToggle = document.getElementById("themeToggle");
  //   if (themeToggle) {
  //     themeToggle.addEventListener("click", () => {
  //       document.documentElement.classList.toggle("dark");
  //       const newTheme = document.documentElement.classList.contains("dark")
  //         ? "dark"
  //         : "light";
  //       localStorage.setItem("theme", newTheme);
  //     });
  //   }
  // }

  setupNavigation() {
    // Sticky navigation
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;

      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    });
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  initializeModules() {
    // Initialize tooltips
    this.initTooltips();

    // Initialize modals
    this.initModals();

    // Initialize form validation
    this.initFormValidation();
  }

  initTooltips() {
    // Tooltip initialization
    const tooltips = document.querySelectorAll("[data-tooltip]");
    tooltips.forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);

        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${
          rect.left + rect.width / 2 - tooltip.offsetWidth / 2
        }px`;
      });

      element.addEventListener("mouseleave", () => {
        document.querySelectorAll(".tooltip").forEach((t) => t.remove());
      });
    });
  }

  initModals() {
    // Modal functionality
    document.querySelectorAll("[data-modal]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.remove("hidden");
        }
      });
    });

    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        e.target.closest(".modal").classList.add("hidden");
      });
    });
  }

  initFormValidation() {
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        const inputs = form.querySelectorAll("[required]");
        let valid = true;

        inputs.forEach((input) => {
          if (!input.value.trim()) {
            valid = false;
            input.classList.add("border-red-500");
          } else {
            input.classList.remove("border-red-500");
          }
        });

        if (!valid) {
          e.preventDefault();
          this.showNotification("Please fill in all required fields", "error");
        }
      });
    });
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-${
          type === "error" ? "exclamation-circle" : "check-circle"
        }"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

///////////////////////////////
// Theme Management
// class ThemeManager {
//   constructor() {
//     this.theme = localStorage.getItem("theme") || "light";
//     this.init();
//   }

//   init() {
//     this.applyTheme();
//     this.setupEventListeners();
//   }

//   applyTheme() {
//     if (this.theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }

//   toggle() {
//     this.theme = this.theme === "dark" ? "light" : "dark";
//     localStorage.setItem("theme", this.theme);
//     this.applyTheme();
//   }

//   setupEventListeners() {
//     const toggleBtn = document.getElementById("themeToggle");
//     if (toggleBtn) {
//       toggleBtn.addEventListener("click", () => this.toggle());
//     }
//   }
// }

// Navigation Manager
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupDropdowns();
  }

  setupScrollBehavior() {
    let lastScroll = 0;
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      if (currentScroll > 50) {
        navbar.classList.add("shadow-lg");
      } else {
        navbar.classList.remove("shadow-lg");
      }

      lastScroll = currentScroll;
    });
  }

  setupMobileMenu() {
    window.toggleMobileMenu = () => {
      const menu = document.getElementById("mobileMenu");
      menu.classList.toggle("hidden");
    };
  }

  setupDropdowns() {
    // Handle user menu dropdown
    window.toggleUserMenu = () => {
      const dropdown = document.getElementById("userDropdown");
      dropdown.classList.toggle("hidden");
    };

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu-btn")) {
        document.getElementById("userDropdown")?.classList.add("hidden");
      }
    });
  }
}

// Market Data Manager
class MarketDataManager {
  constructor() {
    this.init();
  }

  async init() {
    await this.fetchMarketData();
    this.initCharts();
    this.startLiveUpdates();
  }

  async fetchMarketData() {
    try {
      // Simulate API call
      const response = await fetch("/api/market-data");
      // Handle response
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }

  initCharts() {
    // Initialize Chart.js charts
    const chartConfigs = {
      stockChart: this.createChartConfig("line", "#3B82F6"),
      cryptoChart: this.createChartConfig("line", "#F97316"),
      forexChart: this.createChartConfig("line", "#10B981"),
      goldChart: this.createChartConfig("line", "#EAB308"),
    };

    Object.keys(chartConfigs).forEach((chartId) => {
      const canvas = document.getElementById(chartId);
      if (canvas) {
        new Chart(canvas, chartConfigs[chartId]);
      }
    });
  }

  createChartConfig(type, color) {
    return {
      type: type,
      data: {
        labels: Array.from({ length: 10 }, (_, i) => ""),
        datasets: [
          {
            data: Array.from({ length: 10 }, () => Math.random() * 100),
            borderColor: color,
            backgroundColor: color + "20",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    };
  }

  startLiveUpdates() {
    // Update market data every 5 seconds
    setInterval(() => {
      this.updateMarketTicker();
    }, 5000);
  }

  updateMarketTicker() {
    // Update ticker values with random changes
    const tickers = document.querySelectorAll(".ticker-item span:last-child");
    tickers.forEach((ticker) => {
      const change = (Math.random() - 0.5) * 2;
      const isPositive = change > 0;
      ticker.textContent = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;
      ticker.className = isPositive ? "text-green-400" : "text-red-400";
    });
  }
}

// Search Manager
class SearchManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSearch();
    this.setupAutoComplete();
  }

  setupSearch() {
    const searchInputs = document.querySelectorAll(
      'input[type="search"], .search-input'
    );

    searchInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    });
  }

  handleSearch(query) {
    if (query.length < 2) return;

    // Implement search logic
    this.searchStocks(query);
    this.searchNews(query);
  }

  async searchStocks(query) {
    // Implement stock search
    console.log("Searching stocks:", query);
  }

  async searchNews(query) {
    // Implement news search
    console.log("Searching news:", query);
  }

  setupAutoComplete() {
    // Implement autocomplete functionality
  }
}

// AI Chat Manager
class AIChatManager {
  constructor() {
    this.messages = [];
    this.init();
  }

  init() {
    window.openAIChat = () => {
      const widget = document.getElementById("aiChatWidget");
      widget.classList.add("active");
      this.initChat();
    };

    window.closeAIChat = () => {
      const widget = document.getElementById("aiChatWidget");
      widget.classList.remove("active");
    };

    this.setupChatInput();
  }

  setupChatInput() {
    const chatInput = document.querySelector(".chat-input input");
    const sendBtn = document.querySelector(".chat-input button");

    if (chatInput && sendBtn) {
      sendBtn.addEventListener("click", () => {
        this.sendMessage(chatInput.value);
        chatInput.value = "";
      });

      chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage(chatInput.value);
          chatInput.value = "";
        }
      });
    }
  }

  sendMessage(message) {
    if (!message.trim()) return;

    // Add user message
    this.addMessage(message, "user");

    // Simulate AI response
    setTimeout(() => {
      this.getAIResponse(message);
    }, 1000);
  }

  addMessage(text, sender) {
    const chatBody = document.querySelector(".chat-body");
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async getAIResponse(message) {
    // Simulate AI response
    const responses = [
      "Based on current market trends, I'd suggest diversifying your portfolio.",
      "The stock you're asking about has shown positive momentum recently.",
      "Let me analyze that for you. The technical indicators suggest a bullish trend.",
      "According to my analysis, this might be a good entry point.",
      "I'll need more information to provide a comprehensive analysis.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    this.addMessage(response, "bot");
  }

  initChat() {
    // Initialize chat with welcome message if needed
  }
}

// Notification Manager
class NotificationManager {
  constructor() {
    this.init();
  }

  init() {
    this.requestPermission();
    this.setupNotificationHandlers();
  }

  async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }

  setupNotificationHandlers() {
    // Setup notification click handlers
    document.querySelectorAll(".notification-badge").forEach((badge) => {
      badge.parentElement.addEventListener("click", () => {
        this.showNotifications();
      });
    });
  }

  showNotifications() {
    // Show notification panel
    console.log("Showing notifications");
  }

  sendNotification(title, body, icon) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon });
    }
  }
}

// Analytics Manager
class AnalyticsManager {
  constructor() {
    this.init();
  }

  init() {
    this.trackPageView();
    this.setupEventTracking();
  }

  trackPageView() {
    // Track page views
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }

  setupEventTracking() {
    // Track clicks on important elements
    document.querySelectorAll("[data-track]").forEach((element) => {
      element.addEventListener("click", (e) => {
        this.trackEvent("click", e.target.dataset.track);
      });
    });
  }

  trackEvent(action, label, value = null) {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_label: label,
        value: value,
      });
    }
  }
}

// Initialize all managers when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize managers
  // const themeManager = new ThemeManager();
  const navManager = new NavigationManager();
  const marketManager = new MarketDataManager();
  const searchManager = new SearchManager();
  const chatManager = new AIChatManager();
  const notificationManager = new NotificationManager();
  const analyticsManager = new AnalyticsManager();

  // Make managers globally accessible if needed
  window.app = {
    // theme: themeManager,
    nav: navManager,
    market: marketManager,
    search: searchManager,
    chat: chatManager,
    notifications: notificationManager,
    analytics: analyticsManager,
  };

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Add loading animation removal
  setTimeout(() => {
    document.querySelectorAll(".skeleton").forEach((el) => {
      el.classList.remove("skeleton");
    });
  }, 1000);
});

// Service Worker Registration (for PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered:", registration))
      .catch((error) => console.log("SW registration failed:", error));
  });
}

//////////////////////////////

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});

// Utility functions
const utils = {
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  formatNumber(num) {
    return new Intl.NumberFormat("en-US").format(num);
  },

  formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Export utilities
window.utils = utils;
