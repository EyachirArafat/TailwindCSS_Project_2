// analysis.js - Stock Analysis Functionality

class AnalysisManager {
  constructor() {
    this.currentSymbol = null;
    this.charts = {};
    this.activeTab = 'technical';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkUrlParams();
  }

  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol');
    if (symbol) {
      document.getElementById('stockSearch').value = symbol;
      this.analyzeStock(symbol);
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.analysis-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Chart period buttons
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateChartPeriod(btn.textContent);
      });
    });

    // Quick analyze buttons
    window.quickAnalyze = (symbol) => {
      document.getElementById('stockSearch').value = symbol;
      this.analyzeStock(symbol);
    };

    // Analyze button
    window.analyzeStock = () => {
      const symbol = document.getElementById('stockSearch').value.trim().toUpperCase();
      if (symbol) {
        this.analyzeStock(symbol);
      }
    };
  }

  async analyzeStock(symbol) {
    this.currentSymbol = symbol;
    
    // Show loading state
    this.showLoadingState();

    try {
      // Fetch stock data
      const stockData = await this.fetchStockData(symbol);
      
      // Update UI
      this.updateStockHeader(stockData);
      this.showAnalysisResults();
      
      // Initialize charts and analysis
      this.initPriceChart(stockData);
      this.loadTechnicalAnalysis(stockData);
      this.loadFundamentalAnalysis(stockData);
      this.loadSentimentAnalysis(stockData);
      this.loadAIInsights(stockData);
    } catch (error) {
      console.error('Error analyzing stock:', error);
      app.showNotification('Failed to analyze stock', 'error');
    } finally {
      this.hideLoadingState();
    }
  }

  async fetchStockData(symbol) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          symbol: symbol,
          name: this.getCompanyName(symbol),
          price: 189.84,
          change: 2.34,
          changePercent: 1.25,
          volume: 52300000,
          marketCap: 2950000000000,
          pe: 31.42,
          eps: 6.05,
          dividend: 0.48,
          beta: 1.23,
          high52w: 199.62,
          low52w: 164.08,
          priceData: this.generatePriceData()
        });
      }, 1000);
    });
  }

  getCompanyName(symbol) {
    const companies = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'TSLA': 'Tesla, Inc.',
      'NVDA': 'NVIDIA Corporation'
    };
    return companies[symbol] || symbol;
  }

  generatePriceData() {
    const data = [];
    const days = 90;
    let price = 180;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Simulate price movement
      price += (Math.random() - 0.48) * 3;
      const high = price + Math.random() * 2;
      const low = price - Math.random() * 2;
      const close = low + Math.random() * (high - low);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: price,
        high: high,
        low: low,
        close: close,
        volume: Math.floor(40000000 + Math.random() * 20000000)
      });
      
      price = close;
    }
    
    return data;
  }

  updateStockHeader(data) {
    const header = document.querySelector('#analysisResults .stock-header');
    if (!header) return;

    // Update stock info in header
    // This would be done with proper DOM manipulation
  }

  showAnalysisResults() {
    document.getElementById('analysisResults').classList.remove('hidden');
  }

  initPriceChart(stockData) {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (this.charts.price) {
      this.charts.price.destroy();
    }

    this.charts.price = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockData.priceData.map(d => d.date),
        datasets: [{
          label: 'Close Price',
          data: stockData.priceData.map(d => d.close),
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                return `Price: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            }
          },
          y: {
            display: true,
            position: 'right',
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        }
      }
    });
  }

  loadTechnicalAnalysis(stockData) {
    // Calculate technical indicators
    const indicators = this.calculateTechnicalIndicators(stockData.priceData);
    
    // Update UI with indicators
    this.updateTechnicalIndicators(indicators);
  }

  calculateTechnicalIndicators(priceData) {
    // Simple calculations for demo
    const prices = priceData.map(d => d.close);
    const lastPrice = prices[prices.length - 1];
    
    return {
      ma20: this.calculateMA(prices, 20),
      ma50: this.calculateMA(prices, 50),
      ma200: this.calculateMA(prices, 200),
      rsi: this.calculateRSI(prices),
      macd: 'Bullish',
      stochastic: 72.3,
      resistance: lastPrice * 1.03,
      support: lastPrice * 0.96,
      pivot: lastPrice
    };
  }

  calculateMA(prices, period) {
    if (prices.length < period) return 0;
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  calculateRSI(prices, period = 14) {
    // Simplified RSI calculation
    return 65.4; // Mock value
  }

  updateTechnicalIndicators(indicators) {
    // Update DOM with indicator values
    Object.keys(indicators).forEach(key => {
      const element = document.querySelector(`[data-indicator="${key}"]`);
      if (element) {
        const value = typeof indicators[key] === 'number' 
          ? indicators[key].toFixed(2) 
          : indicators[key];
        element.textContent = value;
      }
    });
  }

  loadFundamentalAnalysis(stockData) {
    // Update fundamental metrics
    const metrics = {
      marketCap: utils.formatCurrency(stockData.marketCap),
      pe: stockData.pe.toFixed(2),
      eps: `$${stockData.eps.toFixed(2)}`,
      dividend: `${stockData.dividend}%`
    };

    Object.keys(metrics).forEach(key => {
      const element = document.querySelector(`[data-fundamental="${key}"]`);
      if (element) {
        element.textContent = metrics[key];
      }
    });
  }

  loadSentimentAnalysis(stockData) {
    // Simulate sentiment data
    const sentiment = {
      overall: 75,
      twitter: 82,
      reddit: 68,
      news: 71,
      analystRatings: {
        strongBuy: 18,
        buy: 12,
        hold: 8,
        sell: 2,
        strongSell: 0
      }
    };

    this.updateSentimentUI(sentiment);
  }

  updateSentimentUI(sentiment) {
    // Update sentiment gauge
    const gauge = document.querySelector('.sentiment-gauge .progress-bar');
    if (gauge) {
      gauge.style.width = `${sentiment.overall}%`;
    }

    // Update social sentiment
    ['twitter', 'reddit', 'news'].forEach(source => {
      const element = document.querySelector(`[data-sentiment-source="${source}"]`);
      if (element) {
        element.textContent = `+${sentiment[source]}%`;
      }
    });
  }

  loadAIInsights(stockData) {
    // Generate AI insights
    const insights = {
      summary: `Based on our AI analysis of technical indicators, fundamental metrics, and market sentiment, 
                ${stockData.symbol} shows strong bullish signals with a predicted price target of $205 within the next 3 months.`,
      confidence: 82,
      priceTarget: 205.00,
      riskLevel: 'Medium',
      bullishFactors: [
        'Strong earnings growth trajectory',
        'Positive analyst consensus',
        'Technical breakout above resistance'
      ],
      riskFactors: [
        'High valuation metrics',
        'Regulatory concerns in EU',
        'Supply chain uncertainties'
      ]
    };

    this.updateAIInsightsUI(insights);
  }

  updateAIInsightsUI(insights) {
    // Update AI insights in the UI
    // This would involve DOM manipulation to update the insights section
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.analysis-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Show/hide tab content
    document.querySelectorAll('.analysis-tab-content').forEach(content => {
      content.classList.toggle('hidden', !content.id.includes(tabName));
    });

    this.activeTab = tabName;
  }

  updateChartPeriod(period) {
    // Update chart based on selected period
    const days = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365
    }[period] || 30;

    // Update active button
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === period);
    });

    // Reload chart with new data
    if (this.currentSymbol) {
      this.loadChartData(this.currentSymbol, days);
    }
  }

  async loadChartData(symbol, days) {
    // Fetch and update chart data for specified period
    console.log(`Loading ${days} days of data for ${symbol}`);
  }

  showLoadingState() {
    // Show loading indicator
    const results = document.getElementById('analysisResults');
    if (results) {
      results.classList.add('loading');
    }
  }

  hideLoadingState() {
    // Hide loading indicator
    const results = document.getElementById('analysisResults');
    if (results) {
      results.classList.remove('loading');
    }
  }
}

// Initialize analysis manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stockSearch')) {
    window.analysisManager = new AnalysisManager();
  }
});