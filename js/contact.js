// contact.js - Contact form functionality

class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
  }

  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitContactForm(new FormData(form));
    });
  }

  async submitContactForm(formData) {
    const data = Object.fromEntries(formData);
    
    try {
      // Show loading state
      const submitBtn = document.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form
      document.getElementById('contactForm').reset();
      
      // Show success message
      app.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    } catch (error) {
      console.error('Error sending message:', error);
      app.showNotification('Failed to send message. Please try again.', 'error');
    }
  }
}

// Initialize contact manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('contactForm')) {
    new ContactManager();
  }
});