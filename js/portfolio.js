// portfolio.js - Portfolio Management

class PortfolioManager {
  constructor() {
    this.positions = [];
    this.charts = {};
    this.activeTab = "holdings";
    this.init();
  }

  init() {
    this.loadPortfolioData();
    this.initCharts();
    this.setupEventListeners();
    this.setupTabNavigation();
  }

  async loadPortfolioData() {
    try {
      // Simulate API call
      this.positions = await this.fetchPositions();
      this.renderHoldings();
      this.updatePortfolioMetrics();
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  }

  async fetchPositions() {
    // Simulate API response
    return [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 100,
        avgCost: 150.0,
        currentPrice: 189.84,
        marketValue: 18984,
        gainLoss: 3984,
        gainLossPercent: 26.56,
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        shares: 50,
        avgCost: 450.0,
        currentPrice: 878.35,
        marketValue: 43917,
        gainLoss: 21417,
        gainLossPercent: 95.19,
      },
      {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        shares: 75,
        avgCost: 250.0,
        currentPrice: 238.45,
        marketValue: 17883,
        gainLoss: -866,
        gainLossPercent: -4.62,
      },
    ];
  }

  renderHoldings() {
    const tbody = document.querySelector("#holdings-table tbody");
    if (!tbody) return;

    tbody.innerHTML = this.positions
      .map(
        (position) => `
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="py-4 font-semibold">${position.symbol}</td>
        <td class="py-4">${position.name}</td>
        <td class="py-4 text-right">${position.shares}</td>
        <td class="py-4 text-right">$${position.avgCost.toFixed(2)}</td>
        <td class="py-4 text-right">$${position.currentPrice.toFixed(2)}</td>
        <td class="py-4 text-right font-semibold">${utils.formatCurrency(
          position.marketValue
        )}</td>
        <td class="py-4 text-right ${
          position.gainLoss >= 0 ? "text-green-600" : "text-red-600"
        }">
          ${position.gainLoss >= 0 ? "+" : ""}${utils.formatCurrency(
          position.gainLoss
        )}
        </td>
        <td class="py-4 text-right ${
          position.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"
        }">
          ${
            position.gainLossPercent >= 0 ? "+" : ""
          }${position.gainLossPercent.toFixed(2)}%
        </td>
        <td class="py-4 text-center">
          <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="portfolioManager.viewDetails('${
            position.symbol
          }')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="text-green-600 hover:text-green-800 mr-2" onclick="portfolioManager.buyMore('${
            position.symbol
          }')">
            <i class="fas fa-plus"></i>
          </button>
          <button class="text-red-600 hover:text-red-800" onclick="portfolioManager.sell('${
            position.symbol
          }')">
            <i class="fas fa-minus"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  updatePortfolioMetrics() {
    const totalValue = this.positions.reduce(
      (sum, p) => sum + p.marketValue,
      0
    );
    const totalGain = this.positions.reduce((sum, p) => sum + p.gainLoss, 0);
    const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

    // Update UI elements
    const elements = {
      totalValue: document.querySelector('[data-metric="total-value"]'),
      totalGain: document.querySelector('[data-metric="total-gain"]'),
      totalGainPercent: document.querySelector(
        '[data-metric="total-gain-percent"]'
      ),
    };

    if (elements.totalValue) {
      elements.totalValue.textContent = utils.formatCurrency(totalValue);
    }
    if (elements.totalGain) {
      elements.totalGain.textContent = utils.formatCurrency(totalGain);
    }
    if (elements.totalGainPercent) {
      elements.totalGainPercent.textContent = `${totalGainPercent.toFixed(2)}%`;
    }
  }

  initCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById("performanceChart");
    if (performanceCtx) {
      this.charts.performance = new Chart(performanceCtx, {
        type: "line",
        data: {
          labels: this.generateMonthLabels(12),
          datasets: [
            {
              label: "Portfolio Value",
              data: this.generateGrowthData(12),
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#9CA3AF", // gray-400 for dark mode
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(31, 41, 55, 0.9)", // dark background
              titleColor: "#F3F4F6",
              bodyColor: "#F3F4F6",
              borderColor: "#4B5563",
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: function (context) {
                  return "Value: $" + context.parsed.y.toLocaleString();
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(75, 85, 99, 0.2)", // gray-600 with opacity
                drawBorder: false,
              },
              ticks: {
                color: "#9CA3AF", // gray-400
                font: {
                  size: 11,
                },
              },
            },
            y: {
              grid: {
                color: "rgba(75, 85, 99, 0.2)",
                drawBorder: false,
              },
              ticks: {
                color: "#9CA3AF",
                font: {
                  size: 11,
                },
                callback: function (value) {
                  return "$" + (value / 1000).toFixed(0) + "k";
                },
              },
            },
          },
        },
      });
    }

    // Allocation Chart
    const allocationCtx = document.getElementById("allocationChart");
    if (allocationCtx) {
      const allocationData = this.calculateAllocation();
      this.charts.allocation = new Chart(allocationCtx, {
        type: "doughnut",
        data: {
          labels: allocationData.labels,
          datasets: [
            {
              data: allocationData.values,
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)", // blue
                "rgba(16, 185, 129, 0.8)", // green
                "rgba(245, 158, 11, 0.8)", // amber
                "rgba(239, 68, 68, 0.8)", // red
                "rgba(139, 92, 246, 0.8)", // purple
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(139, 92, 246, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#9CA3AF",
                padding: 15,
                font: {
                  size: 12,
                },
                generateLabels: function (chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    const dataset = data.datasets[0];
                    const total = dataset.data.reduce((a, b) => a + b, 0);

                    return data.labels.map((label, i) => {
                      const value = dataset.data[i];
                      const percentage = ((value / total) * 100).toFixed(1);

                      return {
                        text: `${label}: ${percentage}%`,
                        fillStyle: dataset.backgroundColor[i],
                        strokeStyle: dataset.borderColor[i],
                        lineWidth: 2,
                        hidden: false,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(31, 41, 55, 0.9)",
              titleColor: "#F3F4F6",
              bodyColor: "#F3F4F6",
              borderColor: "#4B5563",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }
  }

  generateMonthLabels(months) {
    const labels = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      labels.push(
        date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      );
    }
    return labels;
  }

  generateGrowthData(months) {
    const data = [];
    let value = 200000;
    for (let i = 0; i < months; i++) {
      value += (Math.random() - 0.3) * 10000;
      data.push(Math.round(value));
    }
    return data;
  }

  calculateAllocation() {
    const allocation = {};
    this.positions.forEach((position) => {
      const sector = this.getSector(position.symbol);
      allocation[sector] = (allocation[sector] || 0) + position.marketValue;
    });

    return {
      labels: Object.keys(allocation),
      values: Object.values(allocation),
    };
  }

  getSector(symbol) {
    const sectors = {
      AAPL: "Technology",
      NVDA: "Technology",
      TSLA: "Automotive",
      MSFT: "Technology",
      GOOGL: "Technology",
    };
    return sectors[symbol] || "Other";
  }

  setupTabNavigation() {
    document.querySelectorAll(".portfolio-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll(".portfolio-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    // Show/hide tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("hidden", !content.id.includes(tabName));
    });

    this.activeTab = tabName;

    // Load tab-specific data if needed
    if (tabName === "transactions") {
      this.loadTransactions();
    } else if (tabName === "analysis") {
      this.loadAnalysis();
    }
  }

  async loadTransactions() {
    // Load transaction history
    const transactions = await this.fetchTransactions();
    this.renderTransactions(transactions);
  }

  async fetchTransactions() {
    // Simulate API call
    return [
      {
        date: "2024-01-15",
        type: "BUY",
        symbol: "AAPL",
        quantity: 50,
        price: 180.5,
        total: 9025,
        status: "Completed",
      },
      {
        date: "2024-01-10",
        type: "SELL",
        symbol: "TSLA",
        quantity: 25,
        price: 245.0,
        total: 6125,
        status: "Completed",
      },
    ];
  }

  renderTransactions(transactions) {
    const tbody = document.querySelector("#transactions-table tbody");
    if (!tbody) return;

    tbody.innerHTML = transactions
      .map(
        (tx) => `
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="py-3">${tx.date}</td>
        <td class="py-3">
          <span class="px-2 py-1 ${
            tx.type === "BUY"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } rounded text-xs font-semibold">
            ${tx.type}
          </span>
        </td>
        <td class="py-3 font-semibold">${tx.symbol}</td>
        <td class="py-3 text-right">${tx.quantity}</td>
        <td class="py-3 text-right">$${tx.price.toFixed(2)}</td>
        <td class="py-3 text-right font-semibold">${utils.formatCurrency(
          tx.total
        )}</td>
        <td class="py-3">
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">${
            tx.status
          }</span>
        </td>
      </tr>
    `
      )
      .join("");
  }

  setupEventListeners() {
    // Add position form
    const addPositionForm = document.getElementById("addPositionForm");
    if (addPositionForm) {
      addPositionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addPosition(new FormData(addPositionForm));
      });
    }

    // Filter buttons
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        this.filterHoldings(chip.textContent.toLowerCase());
      });
    });
  }

  viewDetails(symbol) {
    window.location.href = `/pages/analysis.html?symbol=${symbol}`;
  }

  buyMore(symbol) {
    this.openTradeModal("buy", symbol);
  }

  sell(symbol) {
    this.openTradeModal("sell", symbol);
  }

  openTradeModal(type, symbol) {
    // Open trade modal
    const modal = document.getElementById("tradeModal");
    if (modal) {
      modal.classList.remove("hidden");
      // Set modal data
    }
  }

  async addPosition(formData) {
    try {
      // Add new position
      const position = {
        symbol: formData.get("symbol"),
        quantity: parseInt(formData.get("quantity")),
        price: parseFloat(formData.get("price")),
        date: formData.get("date"),
      };

      // API call would go here
      console.log("Adding position:", position);

      // Refresh portfolio
      await this.loadPortfolioData();

      // Close modal
      this.closeAddPositionModal();

      // Show success message
      app.showNotification("Position added successfully", "success");
    } catch (error) {
      app.showNotification("Error adding position", "error");
    }
  }

  filterHoldings(filter) {
    // Implement filtering logic
    console.log("Filtering by:", filter);
  }
}

// Modal functions
window.openAddPositionModal = () => {
  document.getElementById("addPositionModal").classList.remove("hidden");
};

window.closeAddPositionModal = () => {
  document.getElementById("addPositionModal").classList.add("hidden");
};

// Initialize portfolio manager
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".portfolio-tab")) {
    window.portfolioManager = new PortfolioManager();
  }
});
