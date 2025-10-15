// news.js - News Page Functionality

class NewsManager {
  constructor() {
    this.articles = [];
    this.currentCategory = "all";
    this.currentPage = 1;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.loadNews();
    this.setupEventListeners();
    this.setupInfiniteScroll();
    this.startLiveUpdates();
  }

  async loadNews(category = "all", append = false) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoadingState();

    try {
      const news = await this.fetchNews(category, this.currentPage);

      if (append) {
        this.articles = [...this.articles, ...news];
      } else {
        this.articles = news;
      }

      this.renderNews();
      this.updateLastUpdateTime();
    } catch (error) {
      console.error("Error loading news:", error);
      this.showError("Failed to load news");
    } finally {
      this.isLoading = false;
      this.hideLoadingState();
    }
  }

  async fetchNews(category, page) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title:
              "Federal Reserve Maintains Interest Rates, Signals Future Cuts",
            summary:
              "The Federal Reserve decided to keep interest rates unchanged at their latest meeting...",
            image: "/assets/images/news-4.png",
            category: "economy",
            tags: ["Breaking", "Fed"],
            author: "John Doe",
            timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
            views: 1200,
            likes: 45,
            bookmarked: true,
          },
          {
            id: 2,
            title: "Bitcoin Surges Past $70,000 as ETF Inflows Accelerate",
            summary:
              "Bitcoin reached a new yearly high as institutional investors continue to pour money...",
            image: "/assets/images/news-5.png",
            category: "crypto",
            tags: ["Crypto", "Bitcoin"],
            author: "Jane Smith",
            timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
            views: 3500,
            likes: 120,
            bookmarked: false,
          },
          {
            id: 3,
            title:
              "Stocks Fall as Inflation Risks Mount, Fed Signals Rate Hike",
            summary:
              "The S&P 500 dropped as investors worry about rising inflation and...",
            image: "/assets/images/news-6.png",
            category: "economy",
            tags: ["Economy", "Fed"],
            author: "Alice Johnson",
            timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
            views: 2500,
            likes: 80,
            bookmarked: false,
          },
          {
            id: 4,
            title: "Tech Giants Reportedly Consider Buying Twitter",
            summary:
              "Several tech giants are reportedly considering a potential acquisition of Twitter...",
            image: "/assets/images/news-7.png",
            category: "tech",
            tags: ["Tech", "Twitter"],
            author: "Bob Smith",
            timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
            views: 1800,
            likes: 65,
            bookmarked: false,
          },
        ]);
      }, 500);
    });
  }

  renderNews() {
    const newsFeed = document.getElementById("newsFeed");
    if (!newsFeed) return;

    const newsHTML = this.articles
      .map(
        (article) => `
      <article class="news-article-card" data-article-id="${article.id}">
        <div class="flex gap-4">
          <img src="${article.image}" alt="${article.title}" 
               class="w-32 h-32 object-cover rounded-lg">
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex gap-2 mb-2">
                  ${article.tags
                    .map(
                      (tag) => `
                    <span class="news-tag">${tag}</span>
                  `
                    )
                    .join("")}
                </div>
                <h3 class="font-bold text-lg mb-2 text-white hover:text-blue-600 cursor-pointer" 
                    onclick="newsManager.openArticle(${article.id})">
                  ${article.title}
                </h3>
                <p class="text-gray-400 text-sm mb-3">
                  ${article.summary}
                </p>
              </div>
              <button class="text-gray-400 hover:text-blue-600" 
                      onclick="newsManager.toggleBookmark(${article.id})">
                <i class="fas fa-bookmark ${
                  article.bookmarked ? "text-blue-600" : ""
                }"></i>
              </button>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-4">
                <span><i class="fas fa-clock"></i> ${this.getTimeAgo(
                  article.timestamp
                )}</span>
                <span><i class="fas fa-eye"></i> ${this.formatViews(
                  article.views
                )}</span>
              </div>
              <div class="flex gap-2">
                <button class="hover:text-blue-600" onclick="newsManager.shareArticle(${
                  article.id
                })">
                  <i class="fas fa-share"></i>
                </button>
                <button class="hover:text-red-600" onclick="newsManager.likeArticle(${
                  article.id
                })">
                  <i class="fas fa-heart"></i> ${article.likes}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    if (this.currentPage === 1) {
      newsFeed.innerHTML = newsHTML;
    } else {
      newsFeed.insertAdjacentHTML("beforeend", newsHTML);
    }
  }

  setupEventListeners() {
    // Category filters
    document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        this.filterByCategory(pill.dataset.category);
      });
    });

    // Search functionality
    const searchInput = document.querySelector("#newsSearch");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        utils.debounce((e) => {
          this.searchNews(e.target.value);
        }, 500)
      );
    }

    // Load more button
    const loadMoreBtn = document.querySelector("#loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.currentPage++;
        this.loadNews(this.currentCategory, true);
      });
    }

    // Source filters
    document
      .querySelectorAll('input[type="checkbox"][name="source"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          this.updateSourceFilters();
        });
      });

    // Sentiment filters
    document.querySelectorAll(".sentiment-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterBySentiment(btn.dataset.sentiment);
      });
    });
  }

  filterByCategory(category) {
    // Update active state
    document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.category === category);
    });

    this.currentCategory = category;
    this.currentPage = 1;
    this.loadNews(category);
  }

  async searchNews(query) {
    if (!query.trim()) {
      this.loadNews(this.currentCategory);
      return;
    }

    // Implement search
    console.log("Searching for:", query);
  }

  setupInfiniteScroll() {
    window.addEventListener(
      "scroll",
      utils.throttle(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isLoading) {
          this.currentPage++;
          this.loadNews(this.currentCategory, true);
        }
      }, 1000)
    );
  }

  startLiveUpdates() {
    // Update news every 60 seconds
    setInterval(() => {
      this.checkForNewArticles();
    }, 60000);
  }

  async checkForNewArticles() {
    try {
      const latestNews = await this.fetchNews(this.currentCategory, 1);
      const newArticles = latestNews.filter(
        (article) => !this.articles.find((a) => a.id === article.id)
      );

      if (newArticles.length > 0) {
        this.showNewArticlesNotification(newArticles.length);
      }
    } catch (error) {
      console.error("Error checking for new articles:", error);
    }
  }

  showNewArticlesNotification(count) {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 cursor-pointer";
    notification.innerHTML = `
      <i class="fas fa-bell mr-2"></i>
      ${count} new article${count > 1 ? "s" : ""} available. Click to refresh.
    `;

    notification.addEventListener("click", () => {
      this.loadNews(this.currentCategory);
      notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 10000);
  }

  openArticle(articleId) {
    // Open article in modal or new page
    window.location.href = `/pages/article.html?id=${articleId}`;
  }

  toggleBookmark(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.bookmarked = !article.bookmarked;
      this.renderNews();

      // Save to backend
      this.saveBookmark(articleId, article.bookmarked);
    }
  }

  async saveBookmark(articleId, bookmarked) {
    // API call to save bookmark
    console.log(
      `Article ${articleId} ${bookmarked ? "bookmarked" : "unbookmarked"}`
    );
  }

  shareArticle(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (!article) return;

    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: `/pages/article.html?id=${articleId}`,
      });
    } else {
      // Fallback to copy link
      this.copyArticleLink(articleId);
    }
  }

  copyArticleLink(articleId) {
    const url = `${window.location.origin}/pages/article.html?id=${articleId}`;
    navigator.clipboard.writeText(url);
    app.showNotification("Link copied to clipboard", "success");
  }

  likeArticle(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.likes++;
      this.renderNews();

      // Save to backend
      this.saveLike(articleId);
    }
  }

  async saveLike(articleId) {
    // API call to save like
    console.log(`Article ${articleId} liked`);
  }

  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return new Date(timestamp).toLocaleDateString();
  }

  formatViews(views) {
    if (views < 1000) return views.toString();
    if (views < 1000000) return `${(views / 1000).toFixed(1)}k`;
    return `${(views / 1000000).toFixed(1)}M`;
  }

  updateLastUpdateTime() {
    const lastUpdate = document.getElementById("lastUpdate");
    if (lastUpdate) {
      lastUpdate.textContent = "Just now";
    }
  }

  showLoadingState() {
    const skeleton = document.querySelector(".news-skeleton");
    if (skeleton) {
      skeleton.classList.remove("hidden");
    }
  }

  hideLoadingState() {
    const skeleton = document.querySelector(".news-skeleton");
    if (skeleton) {
      skeleton.classList.add("hidden");
    }
  }

  showError(message) {
    app.showNotification(message, "error");
  }

  updateSourceFilters() {
    const selectedSources = Array.from(
      document.querySelectorAll('input[type="checkbox"][name="source"]:checked')
    ).map((cb) => cb.value);

    console.log("Selected sources:", selectedSources);
    // Reload news with filtered sources
  }

  filterBySentiment(sentiment) {
    console.log("Filtering by sentiment:", sentiment);
    // Implement sentiment filtering
  }
}

// Initialize news manager
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("newsFeed")) {
    window.newsManager = new NewsManager();
  }
});
