// api.js - API Integration Module

class APIClient {
  constructor() {
    this.baseURL = process.env.API_BASE_URL || "https://api.tickerai.com";
    this.apiKey = process.env.API_KEY || "your-api-key";
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${url}-${JSON.stringify(options)}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Market Data APIs
  async getMarketOverview() {
    return this.request("/market/overview");
  }

  async getStockQuote(symbol) {
    return this.request(`/stocks/${symbol}/quote`);
  }

  async getStockChart(symbol, range = "1d") {
    return this.request(`/stocks/${symbol}/chart/${range}`);
  }

  async getTrendingStocks() {
    return this.request("/stocks/trending");
  }

  // News APIs
  async getLatestNews(category = "all", limit = 10) {
    return this.request(`/news/latest?category=${category}&limit=${limit}`);
  }

  async getNewsArticle(id) {
    return this.request(`/news/article/${id}`);
  }

  async searchNews(query) {
    return this.request(`/news/search?q=${encodeURIComponent(query)}`);
  }

  // User APIs
  async getUserProfile() {
    return this.request("/user/profile");
  }

  async updateUserPreferences(preferences) {
    return this.request("/user/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  }

  async getPortfolio() {
    return this.request("/user/portfolio");
  }

  // AI APIs
  async getAIAnalysis(symbol) {
    return this.request(`/ai/analysis/${symbol}`);
  }

  async getAIPrediction(symbol, timeframe = "1w") {
    return this.request(`/ai/prediction/${symbol}?timeframe=${timeframe}`);
  }

  async chatWithAI(message, context = {}) {
    return this.request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    });
  }

  // WebSocket Connection for Real-time Data
  connectWebSocket() {
    this.ws = new WebSocket("wss://stream.tickerai.com");

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.subscribeToChannels();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealtimeData(data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  subscribeToChannels() {
    // Subscribe to market data
    this.ws.send(
      JSON.stringify({
        action: "subscribe",
        channels: ["market", "news", "alerts"],
      })
    );
  }

  handleRealtimeData(data) {
    // Handle different types of real-time data
    switch (data.type) {
      case "market":
        this.updateMarketData(data.payload);
        break;
      case "news":
        this.updateNews(data.payload);
        break;
      case "alert":
        this.showAlert(data.payload);
        break;
    }
  }

  updateMarketData(data) {
    // Update UI with new market data
    document.dispatchEvent(new CustomEvent("marketUpdate", { detail: data }));
  }

  updateNews(data) {
    // Update news feed
    document.dispatchEvent(new CustomEvent("newsUpdate", { detail: data }));
  }

  showAlert(data) {
    // Show price alert notification
    if (window.app?.notifications) {
      window.app.notifications.sendNotification(
        data.title,
        data.message,
        "/assets/icon.png"
      );
    }
  }
}

// Initialize API Client
const apiClient = new APIClient();

// Export for use in other modules
window.API = apiClient;

// Connect WebSocket on page load
document.addEventListener("DOMContentLoaded", () => {
  apiClient.connectWebSocket();
});
