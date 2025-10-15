// dashboard.js - Dashboard specific functionality

class Dashboard {
  constructor() {
    this.charts = {};
    this.init();
  }

  init() {
    this.initCharts();
    this.loadDashboardData();
    this.setupRefreshInterval();
    this.setupEventListeners();
  }

  initCharts() {
    // Portfolio Performance Chart
    const portfolioCtx = document.getElementById("portfolioChart");
    if (portfolioCtx) {
      this.charts.portfolio = new Chart(portfolioCtx, {
        type: "line",
        data: {
          labels: this.generateDateLabels(30),
          datasets: [
            {
              label: "Portfolio Value",
              data: this.generateRandomData(30, 100000, 130000),
              borderColor: "#3B82F6",
              backgroundColor: "#3B82F620",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Value: ${utils.formatCurrency(context.parsed.y)}`;
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => utils.formatCurrency(value),
              },
            },
          },
        },
      });
    }

    // Asset Allocation Chart
    const allocationCtx = document.getElementById("allocationChart");
    if (allocationCtx) {
      this.charts.allocation = new Chart(allocationCtx, {
        type: "doughnut",
        data: {
          labels: ["Stocks", "ETFs", "Crypto", "Cash", "Bonds"],
          datasets: [
            {
              data: [45, 20, 15, 10, 10],
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    }
  }

  generateDateLabels(days) {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }
    return labels;
  }

  generateRandomData(count, min, max) {
    const data = [];
    let current = min + Math.random() * (max - min);

    for (let i = 0; i < count; i++) {
      current += (Math.random() - 0.5) * ((max - min) / 20);
      current = Math.max(min, Math.min(max, current));
      data.push(Math.round(current));
    }
    return data;
  }

  async loadDashboardData() {
    try {
      // Simulate API call
      const data = await this.fetchDashboardData();
      this.updateDashboardUI(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  async fetchDashboardData() {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          portfolioValue: 125430,
          todayGain: 2340,
          todayGainPercent: 1.87,
          positions: 24,
          winRate: 68,
        });
      }, 1000);
    });
  }

  updateDashboardUI(data) {
    // Update stat cards
    const elements = {
      portfolioValue: document.querySelector('[data-stat="portfolio-value"]'),
      todayGain: document.querySelector('[data-stat="today-gain"]'),
      positions: document.querySelector('[data-stat="positions"]'),
      winRate: document.querySelector('[data-stat="win-rate"]'),
    };

    if (elements.portfolioValue) {
      elements.portfolioValue.textContent = utils.formatCurrency(
        data.portfolioValue
      );
    }
    if (elements.todayGain) {
      elements.todayGain.textContent = utils.formatCurrency(data.todayGain);
    }
  }

  setupRefreshInterval() {
    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  setupEventListeners() {
    // Period selector for charts
    document.querySelectorAll(".period-selector").forEach((selector) => {
      selector.addEventListener("change", (e) => {
        this.updateChartPeriod(e.target.value);
      });
    });

    // Export functionality
    const exportBtn = document.querySelector(".export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportDashboardData();
      });
    }
  }

  updateChartPeriod(period) {
    // Update chart data based on selected period
    const days =
      {
        "1W": 7,
        "1M": 30,
        "3M": 90,
        "1Y": 365,
      }[period] || 30;

    if (this.charts.portfolio) {
      this.charts.portfolio.data.labels = this.generateDateLabels(days);
      this.charts.portfolio.data.datasets[0].data = this.generateRandomData(
        days,
        100000,
        130000
      );
      this.charts.portfolio.update();
    }
  }

  exportDashboardData() {
    // Export dashboard data as CSV
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  generateCSV() {
    // Generate CSV content
    return (
      "Date,Portfolio Value,Daily Gain,Win Rate\n" +
      "2024-01-15,125430,2340,68%\n"
    );
  }
}

// Initialize dashboard
// document.addEventListener("DOMContentLoaded", () => {
//   if (document.getElementById("portfolioChart")) {
//     new Dashboard();
//   }
// });
