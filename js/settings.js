// settings.js - Settings Page Functionality

class SettingsManager {
  constructor() {
    this.currentSection = "profile";
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupFormHandlers();
    this.loadUserSettings();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".settings-nav-item");

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const section = item.dataset.section;
        this.switchSection(section);

        // Update active state
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  switchSection(section) {
    // Hide all sections
    document.querySelectorAll(".settings-section").forEach((sec) => {
      sec.classList.add("hidden");
    });

    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.remove("hidden");
      this.currentSection = section;

      // Update URL without reload
      history.pushState(null, "", `#${section}`);
    }
  }

  setupFormHandlers() {
    // Profile form
    const profileForm = document.querySelector("#profile form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveProfile();
      });
    }

    // Preferences form
    const preferencesForm = document.querySelector("#preferences button");
    if (preferencesForm) {
      preferencesForm.addEventListener("click", () => {
        this.savePreferences();
      });
    }

    // Toggle switches
    document.querySelectorAll(".toggle-switch").forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        this.handleToggleChange(e.target);
      });
    });

    // Password change form
    const passwordForm = document.querySelector("#security form");
    if (passwordForm) {
      passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.changePassword();
      });
    }
  }

  async saveProfile() {
    const formData = new FormData(document.querySelector("#profile form"));

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        this.showNotification("Profile updated successfully", "success");
      }
    } catch (error) {
      this.showNotification("Failed to update profile", "error");
    }
  }

  async savePreferences() {
    const preferences = {
      darkMode: document.querySelector('[name="darkMode"]')?.checked,
      compactView: document.querySelector('[name="compactView"]')?.checked,
      showPercentage: document.querySelector('[name="showPercentage"]')
        ?.checked,
      defaultMarket: document.querySelector('[name="defaultMarket"]')?.value,
      currency: document.querySelector('[name="currency"]')?.value,
      autoRefresh: document.querySelector('[name="autoRefresh"]')?.value,
    };

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        this.showNotification("Preferences saved successfully", "success");
        this.applyPreferences(preferences);
      }
    } catch (error) {
      this.showNotification("Failed to save preferences", "error");
    }
  }

  handleToggleChange(toggle) {
    const setting = toggle.closest("label").querySelector("span").textContent;
    console.log(`Toggle changed: ${setting} = ${toggle.checked}`);

    // Apply changes immediately for some settings
    if (setting === "Dark Mode") {
      document.documentElement.classList.toggle("dark", toggle.checked);
      localStorage.setItem("theme", toggle.checked ? "dark" : "light");
    }
  }

  async changePassword() {
    const currentPassword = document.querySelector(
      '[placeholder="Enter current password"]'
    ).value;
    const newPassword = document.querySelector(
      '[placeholder="Enter new password"]'
    ).value;
    const confirmPassword = document.querySelector(
      '[placeholder="Confirm new password"]'
    ).value;

    if (newPassword !== confirmPassword) {
      this.showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        this.showNotification("Password changed successfully", "success");
        document.querySelector("#security form").reset();
      } else {
        this.showNotification("Failed to change password", "error");
      }
    } catch (error) {
      this.showNotification("An error occurred", "error");
    }
  }

  async loadUserSettings() {
    try {
      const response = await fetch("/api/user/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const settings = await response.json();
        this.applySettings(settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  applySettings(settings) {
    // Apply loaded settings to the UI
    if (settings.preferences) {
      Object.keys(settings.preferences).forEach((key) => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === "checkbox") {
            input.checked = settings.preferences[key];
          } else {
            input.value = settings.preferences[key];
          }
        }
      });
    }
  }

  applyPreferences(preferences) {
    // Apply preferences to the current session
    if (preferences.darkMode !== undefined) {
      document.documentElement.classList.toggle("dark", preferences.darkMode);
    }

    if (preferences.compactView !== undefined) {
      document.body.classList.toggle("compact-view", preferences.compactView);
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    } text-white`;

    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : "info-circle"
        }"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Handle file upload for profile picture
  handleProfilePictureUpload(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    fetch("/api/user/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          document.querySelector("#profile img").src = data.url;
          this.showNotification("Profile picture updated", "success");
        }
      })
      .catch((error) => {
        this.showNotification("Failed to upload image", "error");
      });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const settingsManager = new SettingsManager();

  // Handle initial hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    settingsManager.switchSection(hash);
    document.querySelector(`[data-section="${hash}"]`)?.classList.add("active");
  }

  // Handle profile picture upload
  const avatarButton = document.querySelector(".fa-camera").parentElement;
  if (avatarButton) {
    avatarButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        settingsManager.handleProfilePictureUpload(e.target.files[0]);
      };
      input.click();
    });
  }
});
