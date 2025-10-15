// js/main.js - Core Application Logic

import Chart from "chart.js/auto";
import ComponentLoader from "./components.js";

class App {
  constructor() {}

  init() {
    this.setupNavigationAndMenus();
    this.setupSmoothScrolling();
    this.initMarketCharts();
    this.initAIChat();
  }

  setupNavigationAndMenus() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userMenu = document.getElementById("userMenu");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const navbar = document.getElementById("navbar");

    // User Menu Toggle
    if (userMenuBtn && userMenu) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("hidden");
      });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    document.addEventListener("click", () => {
      if (userMenu && !userMenu.classList.contains("hidden")) {
        userMenu.classList.add("hidden");
      }
    });

    // Navbar scroll behavior (Hide on scroll down, show on scroll up)
    let lastScroll = 0;
    if (navbar) {
      window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 100) {
          navbar.style.transform = "translateY(0)";
          navbar.classList.remove("shadow-lg");
          return;
        }
        if (currentScroll > lastScroll) {
          // Scroll Down
          navbar.style.transform = "translateY(-100%)";
        } else {
          // Scroll Up
          navbar.style.transform = "translateY(0)";
          navbar.classList.add("shadow-lg");
        }
        lastScroll = currentScroll;
      });
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  initMarketCharts() {
    const createChartConfig = (color) => ({
      type: "line",
      data: {
        labels: Array.from({ length: 10 }, () => ""),
        datasets: [
          {
            data: Array.from({ length: 10 }, () => Math.random() * 100),
            borderColor: color,
            backgroundColor: `${color}20`,
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
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });

    const charts = {
      stockChart: "#3B82F6",
      cryptoChart: "#F97316",
      forexChart: "#10B981",
      goldChart: "#EAB308",
    };

    for (const [id, color] of Object.entries(charts)) {
      const canvas = document.getElementById(id);
      if (canvas) {
        new Chart(canvas, createChartConfig(color));
      }
    }
  }

  initAIChat() {
    const aiChatBtn = document.getElementById("aiChatBtn");
    const aiChatWidget = document.getElementById("aiChatWidget");
    const closeChatBtn = aiChatWidget?.querySelector(".chat-header button");

    if (aiChatBtn && aiChatWidget) {
      aiChatBtn.addEventListener("click", () => {
        aiChatWidget.classList.add("active");
      });
    }

    if (closeChatBtn) {
      closeChatBtn.addEventListener("click", () => {
        aiChatWidget.classList.remove("active");
      });
    }
  }
}

// --- Application Entry Point ---
document.addEventListener("DOMContentLoaded", async () => {
  const loader = new ComponentLoader();
  await loader.loadAll();

  const app = new App();
  app.init();

  const page = document.body.dataset.page; // HTML body-তে data-page="dashboard" যোগ করতে হবে

  if (page === "dashboard") {
    const { default: Dashboard } = await import("./dashboard.js");
    new Dashboard();
  }
  if (page === "news") {
    const { default: NewsPage } = await import("./news.js");
    new NewsPage();
  }
  if (page === "analysis") {
    const { default: AnalysisPage } = await import("./analysis.js");
    new AnalysisPage();
  }
  if (page === "contact") {
    const { default: ContactPage } = await import("./contact.js");
    new ContactPage();
  }
  if (page === "settings") {
    const { default: SettingsPage } = await import("./settings.js");
    new SettingsPage();
  }
  if (page === "portfolio") {
    const { default: PortfolioPage } = await import("./portfolio.js");
    new PortfolioPage();
  }
  // if( page === "about") {
  //   const { default: AboutPage } = await import("./about.js");
  //   new AboutPage();
  // }
  // if (page === "login") {
  //   const { default: LoginPage } = await import("./login.js");
  //   new LoginPage();
  // }
});
