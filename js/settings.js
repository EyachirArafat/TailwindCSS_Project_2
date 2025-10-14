// settings.js - Settings page functionality

class SettingsManager {
  constructor() {
    this.currentSection = 'profile';
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupForms();
    this.loadSettings();
  }

  setupNavigation() {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(section) {
    // Update navigation
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Show/hide sections
    document.querySelectorAll('.settings-section').forEach(sec => {
      sec.classList.toggle('hidden', sec.id !== `${section}-section`);
    });

    this.currentSection = section;
  }

  setupForms() {
    // Profile form
    const profileForm = document.querySelector('#profile-section form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfileSettings();
      });
    }

    // Notification toggles
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('change', () => {
        this.updateNotificationSettings();
      });
    });
  }

  async loadSettings() {
    try {
      // Load user settings from API
      const settings = await this.fetchSettings();
      this.populateSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async fetchSettings() {
    // Mock settings data
    return {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Experienced investor focused on tech stocks and cryptocurrency markets.'
      },
      notifications: {
        marketAlerts: true,
        dailyDigest: true,
        newsUpdates: false,
        priceAlerts: true,
        breakingNews: true
      }
    };
  }

  populateSettings(settings) {
    // Populate profile fields
    if (settings.profile) {
      Object.keys(settings.profile).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = settings.profile[key];
        }
      });
    }

    // Set notification toggles
    if (settings.notifications) {
      Object.keys(settings.notifications).forEach(key => {
        const toggle = document.querySelector(`[name="${key}"]`);
        if (toggle) {
          toggle.checked = settings.notifications[key];
        }
      });
    }
  }

  async saveProfileSettings() {
    try {
      app.showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      app.showNotification('Failed to update profile', 'error');
    }
  }

  async updateNotificationSettings() {
    try {
      console.log('Updating notification settings...');
      // Save to API
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.settings-nav-item')) {
    new SettingsManager();
  }
});